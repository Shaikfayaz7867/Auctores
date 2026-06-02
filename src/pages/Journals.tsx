import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, BookOpen, Star, Filter, Calendar, Award, 
  ChevronRight, Users, ChevronLeft, Building, Database, 
  MapPin, Phone, HelpCircle, FileText, Globe
} from 'lucide-react';
import { journalService } from '../services/journal.service';
import { articleService } from '../services/article.service';
import { useDBStore } from '../store/dbStore';
import { Journal, Article, EditorProfile } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export const Journals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { db } = useDBStore();

  const journalId = searchParams.get('id');
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  // 1. STATE FOR JOURNAL DIRECTORY (LIST VIEW)
  const [journals, setJournals] = useState<Journal[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [indexing, setIndexing] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'impactFactor' | 'hIndex' | 'acceptanceRate'>('impactFactor');
  const [page, setPage] = useState(1);

  // 2. STATE FOR SINGLE JOURNAL DETAILS VIEW
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [journalArticles, setJournalArticles] = useState<Article[]>([]);
  const [journalEditor, setJournalEditor] = useState<EditorProfile | null>(null);
  const [detailsTab, setDetailsTab] = useState<'articles' | 'about' | 'board'>('articles');

  // Trigger search on parameter updates or state changes
  useEffect(() => {
    if (!journalId) {
      const fetchJournals = async () => {
        const { journals: list, total, pages } = await journalService.getJournals({
          search,
          category,
          indexing,
          sortBy,
          sortOrder: 'desc',
          page,
          limit: 9
        });
        setJournals(list);
        setTotalCount(total);
        setTotalPages(pages);
      };
      fetchJournals();
    }
  }, [journalId, search, category, indexing, sortBy, page]);

  // Handle loading single journal detail
  useEffect(() => {
    if (journalId) {
      const fetchJournalDetails = async () => {
        const jnl = await journalService.getJournalById(journalId);
        if (jnl) {
          setSelectedJournal(jnl);
          
          // Get articles in this journal
          const { articles } = await articleService.getArticles({ journalId, limit: 100 });
          setJournalArticles(articles);

          // Get editor in chief
          const eic = db.editors.find((e: EditorProfile) => e.id === jnl.editorInChiefId);
          setJournalEditor(eic || null);
        }
      };
      fetchJournalDetails();
      setDetailsTab('articles');
    } else {
      setSelectedJournal(null);
    }
  }, [journalId, db.editors]);

  // Handle directory reset
  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setIndexing('');
    setSortBy('impactFactor');
    setPage(1);
    setSearchParams({});
  };

  const categoriesOptions = ['', ...db.categories.map((c: any) => c.name)];
  const indexingOptions = [
    { value: '', label: 'Any Registry' },
    { value: 'Scopus', label: 'Scopus' },
    { value: 'Web of Science (SCIE)', label: 'Web of Science (SCIE)' },
    { value: 'PubMed (MEDLINE)', label: 'PubMed (MEDLINE)' },
    { value: 'DOAJ', label: 'DOAJ' },
    { value: 'Google Scholar', label: 'Google Scholar' }
  ];

  // --- DETAILS VIEW LAYOUT ---
  if (journalId && selectedJournal) {
    const boardMembers = db.editors.filter((e: EditorProfile) => 
      e.assignedJournals.includes(selectedJournal.id) && e.id !== selectedJournal.editorInChiefId
    );

    return (
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-8 font-sans">
        
        {/* Breadcrumb */}
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="cursor-pointer hover:underline" onClick={() => setSearchParams({})}>Journals</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">{selectedJournal.title}</span>
        </div>

        {/* Journal Premium Header Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
          
          <div className="flex items-start gap-5 relative z-10 max-w-3xl">
            <div className="hidden sm:flex h-16 w-16 bg-white rounded-xl items-center justify-center text-primary flex-shrink-0 shadow shadow-black/20 font-serif font-black text-2xl">
              {selectedJournal.title.substring(0, 1)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {selectedJournal.categories.map((cat: string) => (
                  <Badge key={cat} variant="secondary" className="bg-white/10 text-white border-white/10 font-bold uppercase tracking-wider">{cat}</Badge>
                ))}
                <Badge variant="warning" className="bg-amber-500/10 text-amber-300 border-amber-500/20 font-bold">Print ISSN: {selectedJournal.issnPrint}</Badge>
              </div>
              <h1 className="font-serif text-2xl md:text-4xl font-extrabold tracking-tight mt-3">{selectedJournal.title}</h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-2xl">{selectedJournal.description}</p>
            </div>
          </div>

          {/* Quick Metrics card */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 min-w-[200px] relative z-10">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Impact Factor</p>
              <p className="text-xl font-bold text-amber-400 font-serif">{selectedJournal.impactFactor}</p>
            </div>
            <div className="border-t border-slate-800 md:pt-2 md:mt-2">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Acceptance Rate</p>
              <p className="text-base font-bold text-emerald-500">{selectedJournal.acceptanceRate}%</p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          {(['articles', 'about', 'board'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setDetailsTab(tab)}
              className={`font-serif text-sm font-bold pb-3 capitalize transition-colors ${
                detailsTab === tab
                  ? 'text-primary border-b-2 border-[#8B0000] -mb-0.5'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'board' ? 'Editorial Board' : (tab === 'articles' ? 'Current Issues' : 'Policies & Fees')}
            </button>
          ))}
        </div>

        {/* Tabs Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Tab content Column (spans 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* TAB 1: ARTICLES */}
            {detailsTab === 'articles' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-lg font-bold text-primary dark:text-white">Recently Published Papers</h3>
                {journalArticles.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs">
                    No articles have been published in this issue yet.
                  </div>
                ) : (
                  journalArticles.map((art) => (
                    <div 
                      key={art.id} 
                      onClick={() => navigate(`/articles?id=${art.id}`)}
                      className="p-5 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors flex flex-col gap-2 group cursor-pointer"
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-semibold text-[#8B0000]">{art.section || 'Research Paper'}</span>
                        <span>DOI: {art.doi}</span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-primary dark:text-white leading-snug">{art.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{art.abstract}</p>
                      <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 border-t border-slate-50 pt-2">
                        <span>{art.authors.map(a => a.name).join(', ')}</span>
                        <span className="font-medium text-slate-500">{new Date(art.publicationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: ABOUT / POLICIES */}
            {detailsTab === 'about' && (
              <div className="flex flex-col gap-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2">Scope & Focus</h3>
                  <p>{selectedJournal.editorialPolicy}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-6 my-2">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1">Article Processing Charge (APC)</h4>
                    <p className="text-sm font-bold text-[#8B0000] font-sans">${selectedJournal.articleProcessingCharge} USD</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">Required only after acceptance. No submission or review fees. APC waivers are available for low-income economies.</p>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-1">Frequency</h4>
                    <p className="text-sm font-semibold">{selectedJournal.frequency}</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">Rapid manuscript handling, immediate open-access online release as soon as accepted.</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-2">Licensing</h3>
                  <p>All articles published are distributed under a Creative Commons Attribution (CC BY 4.0) license. This permits unrestricted reuse, sharing, and modifications, provided that credit is fully cited.</p>
                </div>
              </div>
            )}

            {/* TAB 3: EDITORIAL BOARD */}
            {detailsTab === 'board' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-3">Editor-in-Chief</h3>
                  {journalEditor ? (
                    <div className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <img src={journalEditor.avatar} alt={journalEditor.name} className="h-14 w-14 rounded-full border border-slate-200" />
                      <div>
                        <h4 className="font-serif text-base font-bold text-slate-900 dark:text-white">{journalEditor.name}</h4>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{journalEditor.affiliation}</p>
                        <p className="text-xs text-[#8B0000] font-medium mt-1 uppercase tracking-wider">EIC / Board Chair</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {journalEditor.specialties.map((spec: string) => (
                            <Badge key={spec} variant="neutral" className="text-[10px]">{spec}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">EIC is undergoing active board review.</p>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-3">Editorial Board Members</h3>
                  {boardMembers.length === 0 ? (
                    <p className="text-xs text-slate-400">Assigned associate editors are listed on the main Editorial Board page.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {boardMembers.map((member: EditorProfile) => (
                        <div key={member.id} className="flex gap-3 p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50/20">
                          <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full border border-slate-100" />
                          <div>
                            <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white leading-tight">{member.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{member.affiliation}</p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-1 uppercase tracking-wider">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar Column */}
          <div className="flex flex-col gap-6">
            
            {/* Submit manuscript card */}
            <Card variant="glass" className="bg-primary text-white p-6 border-0 shadow-lg flex flex-col gap-4">
              <h3 className="font-serif text-lg font-bold leading-snug">Publish in this Journal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Accepting premium research briefs and original full-text articles for our 2026 release volumes. Rigorous fast peer review.
              </p>
              <Link to="/login?redirect=/dashboard/author" className="w-full">
                <Button variant="secondary" className="w-full h-11 bg-[#8B0000] hover:bg-[#6c0000]">
                  Submit Manuscript
                </Button>
              </Link>
            </Card>

            {/* Quick specifications card */}
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base font-serif">Journal Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex flex-col gap-4 text-xs font-sans">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-semibold text-slate-500">Founded Year</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedJournal.foundedYear}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-semibold text-slate-500">CiteScore</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedJournal.citeScore}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-semibold text-slate-500">H-Index</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedJournal.hIndex}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-500 mb-2">Indexing Registries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJournal.indexing.map((ind: string) => (
                      <Badge key={ind} variant="neutral" className="text-[10px] py-0">{ind}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    );
  }

  // --- DIRECTORY / LIST LAYOUT ---
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-8 font-sans">
      
      {/* Title block */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Scientific Journals Directory</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Explore our list of 100 fully peer-reviewed, open-access academic publications</p>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className="flex flex-col gap-6 lg:border-r border-slate-200 dark:border-slate-800 lg:pr-8">
          
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-[#8B0000]" /> Filter Directory
            </h3>
            {(search || category || indexing || sortBy !== 'impactFactor') && (
              <button onClick={handleClearFilters} className="text-xs font-semibold text-rose-500 hover:underline">
                Reset
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            
            {/* Keyword Search */}
            <Input
              label="Journal Name"
              placeholder="Search title, ISSN..."
              value={search}
              onChange={(e: any) => { setSearch(e.target.value); setPage(1); }}
            />

            {/* Categories select */}
            <Select
              label="Subject Domain"
              options={categoriesOptions}
              value={category}
              onChange={(e: any) => { setCategory(e.target.value); setPage(1); }}
            />

            {/* Indexing select */}
            <Select
              label="Indexing Registry"
              options={indexingOptions}
              value={indexing}
              onChange={(e: any) => { setIndexing(e.target.value); setPage(1); }}
            />

            {/* Sort select */}
            <Select
              label="Sort Standards"
              options={[
                { value: 'impactFactor', label: 'Highest Impact Factor' },
                { value: 'hIndex', label: 'Highest H-Index' },
                { value: 'citeScore', label: 'Highest CiteScore' },
                { value: 'title', label: 'Alphabetical A-Z' }
              ]}
              value={sortBy}
              onChange={(e: any) => { setSortBy(e.target.value as any); setPage(1); }}
            />

          </div>

          <Card variant="flat" className="p-4 bg-slate-50 rounded-lg text-xs leading-relaxed text-slate-500">
            Showing <span className="font-bold text-slate-800 dark:text-white">{journals.length}</span> of {totalCount} matching academic journals. All articles are published under CC BY open licensing.
          </Card>
        </aside>

        {/* Journals Grid (Spans 3) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {journals.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4 border border-dashed border-slate-200 rounded-2xl bg-white dark:bg-slate-950 dark:border-slate-800">
              <BookOpen className="h-12 w-12 text-slate-300" />
              <p className="text-sm font-bold text-slate-800 dark:text-white">No Journals Found</p>
              <p className="text-xs text-slate-400 max-w-xs">No publications matched your category, search string, or indexing registries.</p>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filter Setup
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {journals.map((jnl: Journal) => (
                  <Card 
                    key={jnl.id} 
                    variant="default" 
                    className="hover:-translate-y-1 hover:shadow-md duration-200 cursor-pointer flex flex-col h-full justify-between"
                    onClick={() => setSearchParams({ id: jnl.id })}
                  >
                    <div className="p-5 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                      <div className="flex justify-between items-start gap-2">
                        <Badge variant="primary" className="text-[9px] uppercase tracking-wider py-0 font-bold">
                          {jnl.categories[0]}
                        </Badge>
                        <span className="text-[10px] font-bold text-amber-500 font-serif bg-amber-500/5 border border-amber-500/10 px-1.5 py-0.5 rounded">
                          IF: {jnl.impactFactor}
                        </span>
                      </div>
                      <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white mt-3 leading-snug line-clamp-2 hover:text-primary">
                        {jnl.title}
                      </h3>
                    </div>

                    <CardContent className="p-5 flex flex-col gap-4 flex-grow justify-between">
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {jnl.description}
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-slate-50 dark:border-slate-800 mt-2">
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">Acceptance</p>
                          <p className="mt-0.5 font-bold text-emerald-600">{jnl.acceptanceRate}%</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">Decision Speed</p>
                          <p className="mt-0.5 font-bold text-amber-500">{jnl.daysToFirstDecision} Days</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 font-bold text-[#8B0000] hover:text-[#8B0000]"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            setSearchParams({ id: jnl.id });
                          }}
                        >
                          Explore
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
};
