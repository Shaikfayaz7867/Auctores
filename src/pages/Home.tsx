import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, BookOpen, FileText, Landmark, Award, 
  ArrowRight, Users, Eye, Download, GraduationCap, 
  HelpCircle, ChevronDown, CheckCircle2, ChevronRight,
  TrendingUp, Calendar, Hash, ChevronLeft, ChevronRight as ChevronRightIcon,
  Stethoscope
} from 'lucide-react';
import { journalService } from '../services/journal.service';
import { articleService } from '../services/article.service';
import { useDBStore } from '../store/dbStore';
import { Journal, Article } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';

export const Home = () => {
  const navigate = useNavigate();
  const { db } = useDBStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchQueryType] = useState<'articles' | 'journals'>('articles');
  
  const [featuredJournals, setFeaturedJournals] = useState<Journal[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'trending'>('recent');

  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Carousel state
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&q=80',
      alt: 'Scientific Research Laboratory'
    },
    {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
      alt: 'Academic Library'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80',
      alt: 'Modern Office'
    },
    {
      url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=80',
      alt: 'University Campus'
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    // Load data programmatically from services
    const loadHomeData = async () => {
      const { journals } = await journalService.getJournals({ limit: 3, sortBy: 'impactFactor', sortOrder: 'desc' });
      const { articles: recent } = await articleService.getArticles({ limit: 5, sortBy: 'publicationDate', sortOrder: 'desc' });
      const { articles: trending } = await articleService.getArticles({ limit: 5, sortBy: 'citations', sortOrder: 'desc' });
      
      setFeaturedJournals(journals);
      setRecentArticles(recent);
      setTrendingArticles(trending);
    };
    loadHomeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const pathType = searchType === 'journals' ? 'journals' : 'articles';
    navigate(`/${pathType}?search=${encodeURIComponent(searchQuery)}`);
  };

  const [counters, setCounters] = useState({ journals: 0, specialities: 0, advisory: 0 });

  // Animate counters on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCounters({
        journals: Math.floor(79 * easeOut),
        specialities: Math.floor(64 * easeOut),
        advisory: Math.floor(2354 * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters({ journals: 79, specialities: 64, advisory: 2354 });
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { value: counters.journals, label: 'Online Journals', icon: BookOpen, color: 'text-primary', gradient: 'from-blue-500 to-blue-600' },
    { value: counters.specialities, label: 'Specialities', icon: Stethoscope, color: 'text-[#8B0000]', gradient: 'from-red-500 to-red-600' },
    { value: counters.advisory.toLocaleString(), label: 'Advisory Board', icon: Users, color: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' }
  ];

  const workflowSteps = [
    { step: '01', title: 'Manuscript Submission', desc: 'Author uploads manuscript, abstract, keywords, and files via submission wizard.' },
    { step: '02', title: 'Editorial Review', desc: 'Section Editor screens paper for scope, formatting, and plagiarism check.' },
    { step: '03', title: 'Rigorous Peer Review', desc: 'Assigned reviewers perform evaluations and submit critical feedback reports.' },
    { step: '04', title: 'Revision & Decision', desc: 'Authors update manuscript based on review logs; Editorial board accepts/rejects.' },
    { step: '05', title: 'Production & Release', desc: 'Professional typesetting, DOI assignment, and immediate Open Access release.' }
  ];

  return (
    <div className="flex flex-col gap-20 pb-16 font-sans">
      
      {/* 1. Hero Search Section */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-center md:py-32 min-h-[600px]">
        {/* Carousel Background Image */}
        <div className="absolute inset-0">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950/95" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        {/* Academic pattern grid helper overlay */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]" />

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentHeroImage((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentHeroImage((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroImage(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentHeroImage ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-4xl flex flex-col items-center gap-6 z-10">
          <Badge variant="secondary" className="px-4 py-1 animate-pulse border-red-500/20 bg-red-500/10 text-[#FF5A5A]">
            <Award className="h-3.5 w-3.5 mr-1 text-[#FF5A5A]" /> Open Access Publishing Excellence
          </Badge>
          
          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-3xl leading-tight">
            International <span className="italic font-normal text-slate-300">Open Access Publisher</span>
          </h1>
          
          <p className="max-w-xl text-sm md:text-base text-slate-400">
            Auctores is an emerging international open access publisher aimed at development and rapid disseminaion of scientific knowledge to the global community without any restrictions
          </p>

          {/* Dual-State Global Search */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mt-4 flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-xl border border-white/15 backdrop-blur-md">
            <div className="flex bg-white rounded-lg p-1 shadow-inner items-center flex-grow">
              
              {/* Type Picker dropdown */}
              <select 
                value={searchType} 
                onChange={(e: any) => setSearchQueryType(e.target.value as any)}
                className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 py-2 px-3 rounded-md outline-none cursor-pointer"
              >
                <option value="articles">Articles</option>
                <option value="journals">Journals</option>
              </select>

              <Search className="h-5 w-5 text-slate-400 ml-2 flex-shrink-0" />
              <input
                type="text"
                placeholder={searchType === 'articles' ? "Search title, abstract, authors, DOI, keywords..." : "Search journals, scope, indexing..."}
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-sans"
              />
            </div>
            <Button variant="secondary" type="submit" className="h-12 px-6 bg-[#8B0000] hover:bg-[#6c0000]">
              Explore
            </Button>
          </form>

          {/* Quick Category tags */}
          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400 mt-2">
            <span className="font-semibold text-slate-500">Trending Areas:</span>
            {db.categories.slice(0, 4).map((cat: any) => (
              <Link 
                key={cat.id} 
                to={`/journals?category=${encodeURIComponent(cat.name)}`} 
                className="hover:text-white hover:underline flex items-center gap-0.5"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Publication Statistics Section */}
      <section className="mx-auto max-w-7xl w-full px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={idx} 
                variant="glass" 
                className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.2}s both` }}
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500`} />
                
                <CardContent className="relative flex flex-col items-center gap-4 p-8">
                  {/* Floating icon with pulse animation */}
                  <div className={`relative h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 animate-float`}>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent animate-pulse" />
                    <Icon className="h-12 w-12 text-white relative z-10" />
                  </div>
                  
                  <div className="text-center relative z-10">
                    <h3 className="text-5xl font-bold font-sans tracking-tight text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300 transition-all duration-300">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium uppercase tracking-wider group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors duration-300">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. Tabbed Latest vs Highly Cited Articles */}
      <section className="mx-auto max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Articles list column (spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('recent')}
                className={`font-serif text-lg font-bold pb-3 transition-colors ${
                  activeTab === 'recent' 
                    ? 'text-primary border-b-2 border-[#8B0000] -mb-3.5' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Latest Publications
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`font-serif text-lg font-bold pb-3 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'trending' 
                    ? 'text-primary border-b-2 border-[#8B0000] -mb-3.5' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <TrendingUp className="h-4 w-4 text-emerald-500" /> Highly Cited
              </button>
            </div>
            <Link to="/articles" className="text-xs font-semibold text-[#8B0000] hover:underline flex items-center gap-0.5">
              Browse Directory <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {(activeTab === 'recent' ? recentArticles : trendingArticles).map((art: any) => (
              <div 
                key={art.id} 
                className="p-5 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors flex flex-col gap-2 group cursor-pointer"
                onClick={() => navigate(`/articles?id=${art.id}`)}
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-primary">{art.journalTitle}</span>
                  <span className="font-medium">{new Date(art.publicationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                
                <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-primary dark:text-white dark:group-hover:text-[#FF8A8A] leading-snug">
                  {art.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {art.abstract}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    By {art.authors.map(a => a.name).join(', ')}
                  </span>
                  
                  <div className="flex items-center gap-3 font-semibold text-slate-500">
                    <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {art.views}</span>
                    <span className="flex items-center gap-0.5"><Download className="h-3 w-3" /> {art.downloads}</span>
                    {art.citations > 0 && <span className="flex items-center gap-0.5 text-[#8B0000]"><Hash className="h-3 w-3" /> Citations: {art.citations}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Sidebar Column */}
        <div className="flex flex-col gap-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-primary dark:text-white">Research Domains</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {db.categories.map((cat: any) => (
              <Link 
                key={cat.id} 
                to={`/journals?category=${encodeURIComponent(cat.name)}`}
                className="p-3 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-primary dark:hover:border-white hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-white">{cat.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:transform group-hover:translate-x-1 duration-150" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Journals Directory Slider Placeholder */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16 px-6 border-y border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="primary" className="mb-2">Top Tier Impact</Badge>
              <h2 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Featured Journals</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Explore our flagship publishing hubs with indexation in premium registries</p>
            </div>
            <Link to="/journals">
              <Button variant="outline" className="border-slate-300">
                View All 100 Journals <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJournals.map((jnl: any) => (
              <Card key={jnl.id} variant="default" className="hover:-translate-y-1 hover:shadow-lg duration-200">
                <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-950/95 shadow-sm px-2.5 py-0.5 rounded-full border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-[#8B0000]">
                    Impact Factor: {jnl.impactFactor}
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col gap-4">
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white group-hover:text-primary leading-snug line-clamp-1">
                      {jnl.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">{jnl.categories.join(', ')}</p>
                  </div>
                  
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {jnl.description}
                  </p>

                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-1 text-[11px] text-slate-400">
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">Acceptance Rate</p>
                      <p className="mt-0.5 font-bold text-emerald-600">{jnl.acceptanceRate}%</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">Decision Speed</p>
                      <p className="mt-0.5 font-bold text-amber-500">{jnl.daysToFirstDecision} Days</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/journals?id=${jnl.id}`)}
                      className="h-8 text-[#8B0000] hover:text-[#8B0000] font-bold"
                    >
                      Scope
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive Publication Workflow Section */}
      <section className="mx-auto max-w-7xl w-full px-6 flex flex-col gap-10">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <Badge variant="secondary" className="mx-auto">Peer-Reviewed Excellence</Badge>
          <h2 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Editorial Workflow</h2>
          <p className="text-xs text-slate-500 leading-normal dark:text-slate-400">Five stages of robust scholastic assessment ensuring premium scientific rigor</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative mt-4">
          
          {/* Connector lines behind cards for desktop */}
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 hidden md:block z-0" />

          {workflowSteps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3 relative z-10 hover:shadow shadow-sm transition-shadow"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center font-mono">
                {step.step}
              </div>
              <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                {step.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Accordion Panels */}
      <section className="mx-auto max-w-3xl w-full px-6 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <GraduationCap className="h-8 w-8 text-primary mx-auto" />
          <h2 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 leading-normal">Answers for authors, editors, and peer-reviewers publishing under Auctores</p>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {db.faqs.map((faq: any, idx: number) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div 
                key={faq.id} 
                className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <span className="font-serif text-xs md:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-[#8B0000]" /> {faq.question}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CTA Banner for manuscript submission */}
      <section className="mx-auto max-w-7xl w-full px-6">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-slate-900 px-8 py-12 md:py-16 text-center text-white flex flex-col items-center gap-6 relative overflow-hidden shadow-xl border border-white/5">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          
          <Badge variant="secondary" className="bg-white/10 text-white border-white/10 px-4 py-1">
            Accepting Manuscripts 2026
          </Badge>
          
          <h2 className="font-serif text-2xl md:text-4xl font-extrabold tracking-tight max-w-2xl leading-tight">
            Ready to share your academic discovery with the world?
          </h2>
          
          <p className="max-w-md text-xs text-slate-300">
            Submit your research paper to any of our 100 open-access journals. Benefit from fast screening, high-quality peer review, and globally indexed DOI release.
          </p>
          
          <div className="flex items-center gap-4 mt-2">
            <Link to="/login?redirect=/dashboard/author">
              <Button variant="secondary" className="h-11 px-6 bg-[#8B0000] hover:bg-[#6c0000]">
                Submit Manuscript
              </Button>
            </Link>
            <Link to="/journals">
              <Button variant="ghost" className="h-11 px-6 text-white hover:bg-white/10">
                Find Journal <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. About Section */}
      <section className="mx-auto max-w-7xl w-full px-6 flex flex-col gap-12">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <Badge variant="secondary" className="mx-auto">About Auctores</Badge>
          <h2 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Open Access Publishing Excellence</h2>
        </div>

        {/* BOAI Statement */}
        <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Budapest Open Access Initiative (BOAI)</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-primary pl-4">
              Auctores is an ardent supporter of the Budapest Open Access Initiative (BOAI). In accordance with the (BOAI): All articles published by Auctores journals are under the terms of Creative Commons Attribution License. This permits anyone to read, download, copy, share, print or use them for any other legalized determination, without asking permission from the publisher or the author, the original work and source is appropriately cited.
            </p>
          </CardContent>
        </Card>

        {/* Auctores Story */}
        <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#8B0000] to-red-700 flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Auctores Story</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We are supporting the aspirations of our communities by opening up the discovery process to the whole world through openness, accessibility and transparency of research and data.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We encourage the academics all over the globe of various fields to get connected with Auctores and publicize their findings. We follow rigorous standard peer review process and accept papers from all parts of the globe and there is no demographic, racial, and socioeconomic barriers. Auctores facilitate the dissemination of research discoveries to the global community without restriction. Thus, all articles published in Auctores journals are freely available online.
            </p>
          </CardContent>
        </Card>

        {/* Vision and Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="flex flex-col gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg mb-2">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">Our Vision</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                To be recognized globally as a promoter in the scientific community and to be a correspondent in expanding the boundaries of know-how.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="flex flex-col gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#8B0000] to-red-700 flex items-center justify-center shadow-lg mb-2">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Auctores mission is to play a prominent role in global research by publishing the high standard quality articles and convey all scientists, researchers, academics to publish their research work and make it impact globally. Auctores scrupulously emphasis on the advancement of knowledge in critical areas through the delivery of innovative information. We continuously search to make noteworthy assets that will serve research and technical community.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
};
