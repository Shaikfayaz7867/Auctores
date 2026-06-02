import React, { useState, useEffect } from 'react';
import { 
  BarChart as BarIcon, AreaChart as AreaIcon, Users, Settings, 
  Plus, Trash2, CheckCircle, Volume2, HelpCircle, Heart,
  Shield, Eye, Download, FileText, Send, AlertCircle, Award
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { useDBStore } from '../../store/dbStore';
import { analyticsService } from '../../services/analytics.service';
import { 
  AnalyticsSummary, User, Announcement, 
  Testimonial, FAQ 
} from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';

export const AdminDashboard = () => {
  const { db } = useDBStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'cms'>('analytics');
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // USER MANAGEMENT STATE
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // CMS STATE MODALS
  const [isAnnModalOpen, setIsAnnOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqOpen] = useState(false);

  // CMS FORMS
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<'Call for Papers' | 'Event' | 'Policy' | 'Award'>('Call for Papers');
  const [annImportant, setAnnImportant] = useState(false);

  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState<'Authors' | 'Reviewers' | 'Editors' | 'General'>('General');

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await analyticsService.getPlatformAnalytics();
      setAnalytics(data);
    };
    fetchAnalytics();
  }, [db.articles, db.submissions]);

  // Handle CMS Submissions
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: annTitle,
      content: annContent,
      category: annCategory,
      important: annImportant,
      date: new Date().toISOString().split('T')[0]
    };

    useDBStore.setState({
      db: {
        ...db,
        announcements: [newAnn, ...db.announcements]
      }
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnCategory('Call for Papers');
    setAnnImportant(false);
    setIsAnnOpen(false);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) return;

    const newFaq: FAQ = {
      id: `faq-${Date.now()}`,
      question: faqQuestion,
      answer: faqAnswer,
      category: faqCategory
    };

    useDBStore.setState({
      db: {
        ...db,
        faqs: [newFaq, ...db.faqs]
      }
    });

    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('General');
    setIsFaqOpen(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    useDBStore.setState({
      db: {
        ...db,
        announcements: db.announcements.filter((a: Announcement) => a.id !== id)
      }
    });
  };

  const handleDeleteFaq = (id: string) => {
    useDBStore.setState({
      db: {
        ...db,
        faqs: db.faqs.filter((f: FAQ) => f.id !== id)
      }
    });
  };

  // User list filters
  const getFilteredUsers = () => {
    let list = [...db.users];
    if (userSearch) {
      const q = userSearch.toLowerCase();
      list = list.filter((u: User) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (userRoleFilter) {
      list = list.filter((u: User) => u.role === userRoleFilter);
    }
    return list;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-8 font-sans">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">Administrative Control Center</h1>
          <p className="text-xs text-slate-500 mt-1">Supervise platform indexations, analytics graphs, and homepage CMS</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1.5 border">
          {(['analytics', 'users', 'cms'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold px-4 py-2 rounded-md capitalize transition-colors ${
                activeTab === tab 
                  ? 'bg-primary text-white font-bold shadow' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="flex flex-col gap-8">
          {/* Stats overview boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="glass" className="p-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Global Reads</span>
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold font-sans mt-2">{analytics.totalViews.toLocaleString()}</p>
            </Card>

            <Card variant="glass" className="p-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">PDF Downloads</span>
                <Download className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold font-sans mt-2">{analytics.totalDownloads.toLocaleString()}</p>
            </Card>

            <Card variant="glass" className="p-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Manuscripts Submitted</span>
                <FileText className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold font-sans mt-2">{analytics.totalSubmissions}</p>
            </Card>

            <Card variant="glass" className="p-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Global Citations</span>
                <Award className="h-4 w-4 text-[#8B0000]" />
              </div>
              <p className="text-2xl font-bold font-sans mt-2">{analytics.citationsCount.toLocaleString()}</p>
            </Card>
          </div>

          {/* Recharts Traffic Plot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card variant="default" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-1.5"><AreaIcon className="h-4 w-4 text-primary" /> 30-Day View & Download Traffic</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.dailyMetrics}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#002F6C" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#002F6C" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} style={{ fontSize: '10px' }} />
                    <YAxis tickLine={false} style={{ fontSize: '10px' }} />
                    <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'sans-serif' }} />
                    <Legend style={{ fontSize: '11px' }} />
                    <Area type="monotone" name="Views" dataKey="views" stroke="#002F6C" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                    <Area type="monotone" name="Downloads" dataKey="downloads" stroke="#10B981" fillOpacity={1} fill="url(#colorDownloads)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recharts Domain Distribution Chart */}
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-1.5"><BarIcon className="h-4 w-4 text-primary" /> Domain Popularity</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.viewsByCategory.slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickLine={false} style={{ fontSize: '10px' }} />
                    <YAxis dataKey="category" type="category" tickLine={false} width={80} style={{ fontSize: '9px', fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ fontSize: '11px' }} />
                    <Bar name="Total Reads" dataKey="count" fill="#8B0000" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 border rounded-xl items-center">
            <div className="flex-grow w-full">
              <Input
                placeholder="Search scholars by name, email, or ORCID ID..."
                value={userSearch}
                onChange={(e: any) => setUserSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                options={[
                  { value: '', label: 'All Roles' },
                  { value: 'author', label: 'Authors Only' },
                  { value: 'reviewer', label: 'Reviewers Only' },
                  { value: 'editor', label: 'Editors Only' },
                  { value: 'admin', label: 'Admins Only' }
                ]}
                value={userRoleFilter}
                onChange={(e: any) => setUserRoleFilter(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Academic Email</TableHead>
                <TableHead>Affiliation / Center</TableHead>
                <TableHead>Role Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredUsers().slice(0, 50).map((u: User) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs font-semibold text-primary">{u.id}</TableCell>
                  <TableCell className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <img src={u.avatar} className="h-6 w-6 rounded-full border" alt="" />
                    {u.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">{u.email}</TableCell>
                  <TableCell className="text-xs leading-normal">{u.affiliation || 'Unassigned Office'}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === 'admin' ? 'secondary' : (u.role === 'editor' ? 'success' : 'neutral')} className="font-bold uppercase tracking-wider text-[10px]">
                      {u.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* TAB 3: CMS & HOMEPAGE MANAGER */}
      {activeTab === 'cms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CMS: Announcements lists */}
          <div className="flex flex-col gap-4 border-r border-slate-100 pr-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-1.5">
                <Volume2 className="h-5 w-5 text-[#8B0000]" /> Homepage Announcements
              </h3>
              <Button size="sm" variant="outline" onClick={() => setIsAnnOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Notice
              </Button>
            </div>

            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              {db.announcements.map((ann: Announcement) => (
                <div key={ann.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" className="text-[8px] uppercase tracking-wider py-0 font-bold">{ann.category}</Badge>
                      {ann.important && <Badge variant="secondary" className="text-[8px] bg-red-50 text-red-700 py-0">Important</Badge>}
                    </div>
                    <h4 className="font-serif text-xs md:text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">{ann.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-2">{ann.content}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAnnouncement(ann.id)} className="text-rose-500 h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* CMS: FAQs listings */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-primary dark:text-white flex items-center gap-1.5">
                <HelpCircle className="h-5 w-5 text-[#8B0000]" /> Informational FAQs
              </h3>
              <Button size="sm" variant="outline" onClick={() => setIsFaqOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add FAQ
              </Button>
            </div>

            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              {db.faqs.map((f: FAQ) => (
                <div key={f.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-start gap-4">
                  <div>
                    <Badge variant="neutral" className="text-[8px] py-0">{f.category}</Badge>
                    <h4 className="font-serif text-xs font-bold text-slate-900 mt-2 leading-snug">Q: {f.question}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">A: {f.answer}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteFaq(f.id)} className="text-rose-500 h-8 w-8 p-0 flex-shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: ADD ANNOUNCEMENT */}
      <Modal
        isOpen={isAnnModalOpen}
        onClose={() => setIsAnnOpen(false)}
        title="Publish Homepage Notice"
        size="md"
      >
        <form onSubmit={handleAddAnnouncement} className="flex flex-col gap-4 text-xs font-sans">
          <Input
            label="Announcement Title"
            placeholder="e.g. Call for Papers: Special issue on Deep Learning"
            value={annTitle}
            onChange={(e: any) => setAnnTitle(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Notice Body Content</label>
            <textarea
              placeholder="Write detailed announcements description..."
              value={annContent}
              onChange={(e: any) => setAnnContent(e.target.value)}
              required
              className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Topic Category"
              options={['Call for Papers', 'Event', 'Policy', 'Award']}
              value={annCategory}
              onChange={(e: any) => setAnnCategory(e.target.value as any)}
            />
            
            <div className="flex items-center gap-2 mt-6 pl-2">
              <input
                id="notice-important-check"
                type="checkbox"
                checked={annImportant}
                onChange={(e: any) => setAnnImportant(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="notice-important-check" className="font-semibold text-slate-600">Flag as Important</label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 border-t pt-4">
            <Button variant="outline" type="button" onClick={() => setIsAnnOpen(false)}>Cancel</Button>
            <Button variant="secondary" type="submit" className="bg-[#8B0000]">Publish Notice</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD FAQ */}
      <Modal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqOpen(false)}
        title="Register Portal FAQ"
        size="md"
      >
        <form onSubmit={handleAddFaq} className="flex flex-col gap-4 text-xs font-sans">
          <Input
            label="Inquiry Question"
            placeholder="e.g. What is the average decision speed on Auctores?"
            value={faqQuestion}
            onChange={(e: any) => setFaqQuestion(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Answer Explanation</label>
            <textarea
              placeholder="Provide a comprehensive answer detailing policies..."
              value={faqAnswer}
              onChange={(e: any) => setFaqAnswer(e.target.value)}
              required
              className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <Select
            label="Filter Category Tag"
            options={['General', 'Authors', 'Reviewers', 'Editors']}
            value={faqCategory}
            onChange={(e: any) => setFaqCategory(e.target.value as any)}
          />

          <div className="flex justify-end gap-2 mt-4 border-t pt-4">
            <Button variant="outline" type="button" onClick={() => setIsFaqOpen(false)}>Cancel</Button>
            <Button variant="secondary" type="submit" className="bg-[#8B0000]">Register FAQ</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
