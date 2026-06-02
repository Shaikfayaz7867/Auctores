import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, FileText, ChevronRight, Download, Eye, 
  Copy, CheckCircle2, ChevronLeft, ArrowLeft, BookOpen, 
  ZoomIn, ZoomOut, Maximize2, Share2, Award, Info, Hash
} from 'lucide-react';
import { articleService } from '../services/article.service';
import { useDBStore } from '../store/dbStore';
import { Article } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { db } = useDBStore();

  const articleId = searchParams.get('id');
  const initialSearch = searchParams.get('search') || '';

  // 1. DIRECTORY STATE
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(initialSearch);
  const [journalId, setJournalId] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<'publicationDate' | 'citations' | 'views' | 'downloads' | 'title'>('publicationDate');
  const [page, setPage] = useState(1);

  // 2. ARTICLE DETAILS STATE
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [citationStyle, setCitationStyle] = useState<'APA' | 'AMA' | 'Harvard' | 'BibTeX'>('APA');
  const [citationCopied, setCitationCopied] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);

  // Load directory list
  useEffect(() => {
    if (!articleId) {
      const fetchArticles = async () => {
        const { articles: list, total, pages } = await articleService.getArticles({
          search,
          journalId,
          category,
          sortBy,
          sortOrder: 'desc',
          page,
          limit: 10
        });
        setArticles(list);
        setTotalCount(total);
        setTotalPages(pages);
      };
      fetchArticles();
    }
  }, [articleId, search, journalId, category, sortBy, page]);

  // Load selected article details
  useEffect(() => {
    if (articleId) {
      const fetchArticleDetails = async () => {
        const art = await articleService.getArticleById(articleId);
        if (art) {
          setSelectedArticle(art);
          
          // Increment views asynchronously
          articleService.incrementStats(art.id, 'views');

          // Load related articles
          const { articles: related } = await articleService.getArticles({
            journalId: art.journalId,
            limit: 3
          });
          setRelatedArticles(related.filter(r => r.id !== art.id));
        }
      };
      fetchArticleDetails();
    } else {
      setSelectedArticle(null);
    }
  }, [articleId]);

  const handleClearFilters = () => {
    setSearch('');
    setJournalId('');
    setCategory('');
    setSortBy('publicationDate');
    setPage(1);
    setSearchParams({});
  };

  // Simulated PDF download action
  const handlePdfDownload = () => {
    if (!selectedArticle) return;
    articleService.incrementStats(selectedArticle.id, 'downloads');
    
    // Create and trigger a virtual download anchor
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `${selectedArticle.slug}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Live update downloaded count locally
    setSelectedArticle({
      ...selectedArticle,
      downloads: selectedArticle.downloads + 1
    });
  };

  // Citation generator logic
  const generateCitationText = () => {
    if (!selectedArticle) return '';
    const firstAuthor = selectedArticle.authors[0];
    const year = new Date(selectedArticle.publicationDate).getFullYear();
    const restAuthors = selectedArticle.authors.length > 1 ? ' et al.' : '';
    const authorString = `${firstAuthor.name.split(' ').pop()}, ${firstAuthor.name.substring(0, 1)}.${restAuthors}`;

    switch (citationStyle) {
      case 'APA':
        return `${authorString} (${year}). ${selectedArticle.title}. ${selectedArticle.journalTitle}, 1(1), 1-15. https://doi.org/${selectedArticle.doi}`;
      case 'AMA':
        return `${firstAuthor.name.split(' ').pop()} ${firstAuthor.name.substring(0, 1)}${selectedArticle.authors.length > 1 ? ', et al' : ''}. ${selectedArticle.title}. ${selectedArticle.journalTitle}. ${year};1(1):1-15.`;
      case 'Harvard':
        return `${firstAuthor.name.split(' ').pop()}, ${firstAuthor.name.substring(0, 1)}.${year}. '${selectedArticle.title}', ${selectedArticle.journalTitle}, 1(1), pp. 1-15.`;
      case 'BibTeX':
        return `@article{auctores_${selectedArticle.id},\n  author = {${selectedArticle.authors.map((a: any) => a.name).join(' and ')}},\n  title = {${selectedArticle.title}},\n  journal = {${selectedArticle.journalTitle}},\n  year = {${year}},\n  doi = {${selectedArticle.doi}}\n}`;
      default:
        return '';
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(generateCitationText());
    setCitationCopied(true);
    setTimeout(() => setCitationCopied(false), 3000);
  };

  const journalsOptions = [{ value: '', label: 'All Journals' }, ...db.journals.map((j: any) => ({ value: j.id, label: j.title }))];
  const categoriesOptions = ['', ...db.categories.map((c: any) => c.name)];

  // --- SINGLE ARTICLE DETAILED VIEW ---
  if (articleId && selectedArticle) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-8 font-sans">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="cursor-pointer hover:underline" onClick={() => setSearchParams({})}>Articles</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 dark:text-slate-300 font-medium line-clamp-1">{selectedArticle.title}</span>
        </div>

        {/* Article Back Button */}
        <div>
          <button 
            onClick={() => setSearchParams({})}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Articles Directory
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Article Content (spans 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Meta tags and journal heading */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="secondary" className="font-bold text-[#8B0000]">{selectedArticle.section || 'Research Paper'}</Badge>
                <Badge variant="primary">Open Access</Badge>
                <span className="text-xs text-slate-400">Published: {new Date(selectedArticle.publicationDate).toLocaleDateString()}</span>
              </div>
              <Link to={`/journals?id=${selectedArticle.journalId}`} className="text-sm font-bold text-primary hover:underline font-serif">
                {selectedArticle.journalTitle}
              </Link>
              <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {selectedArticle.title}
              </h1>
            </div>

            {/* Authors and Affiliations List */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Authors:</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                {selectedArticle.authors.map((auth: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="font-semibold text-slate-800 dark:text-white">{auth.name}</span>
                    {auth.isCorresponding && <Badge variant="warning" className="text-[9px] px-1 py-0 font-bold">Corresponding Author</Badge>}
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-2 mt-1 text-[10px] text-slate-400">
                {selectedArticle.authors.map((auth: any, idx: number) => (
                  <p key={idx} className="leading-relaxed">
                    <sup>{idx + 1}</sup> {auth.affiliation} ({auth.email})
                  </p>
                ))}
              </div>
            </div>

            {/* Abstract card */}
            <div className="flex flex-col gap-3 leading-relaxed">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">Abstract</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm leading-relaxed">
                {selectedArticle.abstract}
              </p>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="font-bold text-slate-400">Keywords:</span>
              {selectedArticle.keywords.map((kw: string) => (
                <Badge key={kw} variant="neutral" className="text-[10px]">{kw}</Badge>
              ))}
            </div>

            {/* SECTION: PDF VIEWER UI */}
            <div className="flex flex-col gap-3 mt-4">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">PDF Full-Text View</h3>
              
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex flex-col">
                {/* PDF Controls */}
                <div className="px-4 py-2.5 bg-slate-200 dark:bg-slate-950 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setPdfZoom(Math.max(50, pdfZoom - 25))} className="h-8 w-8 p-0"><ZoomOut className="h-4 w-4" /></Button>
                    <span>{pdfZoom}%</span>
                    <Button variant="ghost" size="sm" onClick={() => setPdfZoom(Math.min(200, pdfZoom + 25))} className="h-8 w-8 p-0"><ZoomIn className="h-4 w-4" /></Button>
                  </div>
                  <span>Page 1 of 15</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Maximize2 className="h-4 w-4" /></Button>
                    <Button variant="secondary" onClick={handlePdfDownload} className="h-8 bg-[#8B0000] text-white text-xs px-3">
                      <Download className="h-3.5 w-3.5 mr-1" /> Download PDF
                    </Button>
                  </div>
                </div>

                {/* PDF Simulated Viewport */}
                <div className="h-96 overflow-auto p-8 flex justify-center items-start">
                  <div 
                    style={{ width: `${pdfZoom}%`, maxWidth: '100%' }}
                    className="aspect-[1/1.41] bg-white dark:bg-slate-950 p-10 shadow-lg border border-slate-300/50 dark:border-slate-800/50 font-serif text-[10px] text-slate-800 dark:text-slate-300 flex flex-col gap-6 leading-relaxed transition-all duration-150"
                  >
                    <div className="text-center border-b border-slate-100 pb-3 flex flex-col gap-1 text-slate-400">
                      <p className="font-sans text-[8px] uppercase tracking-widest font-bold">Auctores Academic Journal Publication</p>
                      <p className="text-[7px]">Open Access Peer-Reviewed • https://doi.org/{selectedArticle.doi}</p>
                    </div>

                    <h1 className="text-sm font-bold text-center leading-snug text-slate-950 dark:text-white">{selectedArticle.title}</h1>
                    <p className="text-center font-sans font-semibold text-[8px]">{selectedArticle.authors.map((a: any) => a.name).join(', ')}</p>
                    
                    <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-900/50 p-4 border rounded">
                      <p className="font-sans font-bold text-[8px] uppercase">Abstract</p>
                      <p className="text-[7px] leading-normal">{selectedArticle.abstract}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="font-sans font-bold text-[8px] uppercase border-b border-slate-100 pb-0.5 mt-2">1. Introduction</p>
                      <p className="text-[7px] leading-normal">Scholarly publication plays a core role in the democratization of knowledge. This manuscript explores critical parameters regarding open-access frameworks...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* REFERENCES LIST */}
            <div className="flex flex-col gap-3 mt-4 border-t border-slate-100 pt-6">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">References</h3>
              <ol className="list-decimal pl-5 flex flex-col gap-3 text-xs text-slate-500 leading-normal">
                {selectedArticle.references.map((ref: string, rIdx: number) => (
                  <li key={rIdx} className="pl-2">
                    {ref}
                  </li>
                ))}
              </ol>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="flex flex-col gap-6">
            
            {/* Citation Copy Box */}
            <Card variant="default">
              <CardHeader className="flex justify-between items-center flex-row">
                <CardTitle className="text-base font-serif">Cite this Paper</CardTitle>
                <div className="flex gap-1">
                  {(['APA', 'AMA', 'Harvard', 'BibTeX'] as const).map((style: any) => (
                    <button
                      key={style}
                      onClick={() => setCitationStyle(style)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        citationStyle === style 
                          ? 'bg-[#8B0000] text-white' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex flex-col gap-3">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-xs font-mono break-all leading-normal select-all">
                  {generateCitationText()}
                </div>
                {citationCopied ? (
                  <div className="flex items-center gap-1.5 justify-center text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" /> Citation copied!
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleCopyCitation} className="w-full">
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Citation Reference
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Metrics block */}
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base font-serif">Paper Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex flex-col gap-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500 flex items-center gap-1"><Eye className="h-4 w-4" /> Full Views</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedArticle.views}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500 flex items-center gap-1"><Download className="h-4 w-4" /> PDF Downloads</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedArticle.downloads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-500 flex items-center gap-1"><Award className="h-4 w-4" /> Citation Count</span>
                  <span className="font-bold text-[#8B0000]">{selectedArticle.citations}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Papers Column */}
            <div className="flex flex-col gap-3">
              <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white">Related Research</h4>
              {relatedArticles.map((rel: Article) => (
                <div 
                  key={rel.id} 
                  onClick={() => setSearchParams({ id: rel.id })}
                  className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 cursor-pointer flex flex-col gap-1 transition-colors"
                >
                  <h5 className="font-serif text-xs font-bold leading-snug line-clamp-2 hover:text-primary">{rel.title}</h5>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{rel.journalTitle}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    );
  }

  // --- DIRECTORY / LIST VIEW ---
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-8 font-sans">
      
      {/* Title block */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Scientific Articles Index</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Explore and search indexed scholarly articles published under CC BY open licensing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Advanced Filter options */}
        <aside className="flex flex-col gap-6 lg:border-r border-slate-200 dark:border-slate-800 lg:pr-8">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[#8B0000]" /> Filter Articles
            </h3>
            {(search || journalId || category || sortBy !== 'publicationDate') && (
              <button onClick={handleClearFilters} className="text-xs font-semibold text-rose-500 hover:underline">
                Reset
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Search keywords */}
            <Input
              label="Keywords & Text"
              placeholder="Search title, DOI, author..."
              value={search}
              onChange={(e: any) => { setSearch(e.target.value); setPage(1); }}
            />

            {/* Filter by specific journal */}
            <Select
              label="Journal Source"
              options={journalsOptions}
              value={journalId}
              onChange={(e: any) => { setJournalId(e.target.value); setPage(1); }}
            />

            {/* Filter by Categories */}
            <Select
              label="Subject Domain"
              options={categoriesOptions}
              value={category}
              onChange={(e: any) => { setCategory(e.target.value); setPage(1); }}
            />

            {/* Sort options */}
            <Select
              label="Sort Papers By"
              options={[
                { value: 'publicationDate', label: 'Latest Release Date' },
                { value: 'citations', label: 'Highly Cited First' },
                { value: 'views', label: 'Most Viewed First' },
                { value: 'downloads', label: 'Most Downloaded First' },
                { value: 'title', label: 'Title Alphabetical A-Z' }
              ]}
              value={sortBy}
              onChange={(e: any) => { setSortBy(e.target.value as any); setPage(1); }}
            />
          </div>

          <Card variant="flat" className="p-4 bg-slate-50 text-xs leading-relaxed text-slate-500">
            Showing <span className="font-bold text-slate-800 dark:text-white">{articles.length}</span> of {totalCount} matching scientific publications.
          </Card>
        </aside>

        {/* Paginated articles index list */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {articles.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4 border border-dashed border-slate-200 rounded-2xl bg-white dark:bg-slate-950 dark:border-slate-800">
              <FileText className="h-12 w-12 text-slate-300" />
              <p className="text-sm font-bold text-slate-800 dark:text-white">No Articles Found</p>
              <p className="text-xs text-slate-400 max-w-xs">No peer-reviewed papers matched your keyword search, journal, or category setup.</p>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filter Setup
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {articles.map((art: Article) => (
                  <div 
                    key={art.id} 
                    onClick={() => setSearchParams({ id: art.id })}
                    className="p-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-all flex flex-col gap-2 group cursor-pointer"
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="font-semibold text-primary">{art.journalTitle}</span>
                      <span>DOI: {art.doi}</span>
                    </div>

                    <h3 className="font-serif text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-[#FF8A8A] leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {art.abstract}
                    </p>

                    <div className="flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-50 dark:border-slate-800 pt-3 mt-2">
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {art.authors.map((a: any) => a.name).join(', ')}
                      </span>
                      <div className="flex items-center gap-3 font-semibold text-slate-500">
                        <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {art.views}</span>
                        <span className="flex items-center gap-0.5"><Download className="h-3.5 w-3.5" /> {art.downloads}</span>
                        {art.citations > 0 && <span className="flex items-center gap-0.5 text-[#8B0000]"><Hash className="h-3 w-3" /> Citations: {art.citations}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
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
