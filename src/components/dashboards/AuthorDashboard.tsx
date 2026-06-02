import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Shield, CheckCircle2, AlertCircle, Clock, 
  Send, UserPlus, Trash2, ArrowRight, ChevronRight, Upload
} from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import { useAuthStore } from '../../store/authStore';
import { useDBStore } from '../../store/dbStore';
import { Submission, Journal, ArticleAuthor } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export const AuthorDashboard = () => {
  const { user } = useAuthStore();
  const { db } = useDBStore();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // WIZARD STATE
  const [wizardStep, setWizardStep] = useState(1);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [selectedJournalId, setSelectedJournalId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [coAuthors, setCoAuthors] = useState<ArticleAuthor[]>([]);
  const [fileName, setFileName] = useState('');

  // Co-author input state
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorAff, setAuthorAff] = useState('');

  useEffect(() => {
    if (user) {
      const loadSubmissions = async () => {
        const list = await dashboardService.getSubmissionsByAuthor(`aut-${user.id.split('-').pop()}`);
        setSubmissions(list);
      };
      loadSubmissions();
    }
  }, [user, db.submissions]);

  const handleAddCoAuthor = () => {
    if (!authorName || !authorEmail || !authorAff) return;
    const newAuth: ArticleAuthor = {
      name: authorName,
      email: authorEmail,
      affiliation: authorAff,
      isCorresponding: false
    };
    setCoAuthors([...coAuthors, newAuth]);
    setAuthorName('');
    setAuthorEmail('');
    setAuthorAff('');
  };

  const handleRemoveCoAuthor = (idx: number) => {
    setCoAuthors(coAuthors.filter((_val: ArticleAuthor, i: number) => i !== idx));
  };

  const handleWizardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !abstract || !selectedJournalId) return;

    setLoading(true);
    const selectedJournal = db.journals.find((j: Journal) => j.id === selectedJournalId)!;
    const authorId = `aut-${user.id.split('-').pop()}`;

    const submissionData = {
      title,
      abstract,
      journalId: selectedJournalId,
      journalTitle: selectedJournal.title,
      authorId,
      authorName: user.name,
      authors: [
        { name: user.name, email: user.email, affiliation: user.affiliation || '', isCorresponding: true, orcid: user.orcid },
        ...coAuthors
      ],
      fileUrl: `/files/upload-${Date.now()}.docx`,
      fileName: fileName || 'manuscript.docx',
      keywords: keywords.split(',').map((k: string) => k.trim()),
      coverLetter
    };

    try {
      await dashboardService.submitManuscript(submissionData);
      
      // Reset Wizard
      setTitle('');
      setAbstract('');
      setKeywords('');
      setSelectedJournalId('');
      setCoverLetter('');
      setCoAuthors([]);
      setFileName('');
      setWizardStep(1);
      
      setIsSubmitModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Aggregated Stats
  const statSubmitted = submissions.length;
  const statUnderReview = submissions.filter((s: Submission) => s.status === 'under_peer_review').length;
  const statRevision = submissions.filter((s: Submission) => s.status === 'revision_required').length;
  const statAccepted = submissions.filter((s: Submission) => s.status === 'accepted' || s.status === 'published').length;

  const statusColors = {
    submitted: 'warning',
    under_peer_review: 'info',
    revision_required: 'secondary',
    revised: 'primary',
    accepted: 'success',
    published: 'success',
    rejected: 'error'
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-8 font-sans">
      
      {/* Overview stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">Author Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">Submit and track your peer-review manuscript workflows</p>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-[#8B0000]"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Submit New Manuscript
        </Button>
      </div>

      {/* Metrics board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Submissions</span>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{statSubmitted}</p>
        </Card>
        
        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Under Peer Review</span>
            <Clock className="h-4 w-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{statUnderReview}</p>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Revisions Requested</span>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{statRevision}</p>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Accepted Papers</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{statAccepted}</p>
        </Card>
      </div>

      {/* Submissions Datatable */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif text-lg font-bold text-primary dark:text-white">Active Manuscripts Queue</h3>
        {submissions.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center gap-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950">
            <FileText className="h-12 w-12 text-slate-300" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">No active submissions</p>
            <p className="text-xs text-slate-400 max-w-xs">You have not submitted any scientific manuscripts to Auctores yet.</p>
            <Button variant="outline" size="sm" onClick={() => setIsSubmitModalOpen(true)}>
              Submit First Paper
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manuscript ID</TableHead>
                <TableHead className="w-1/2">Title</TableHead>
                <TableHead>Journal</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((sub: Submission) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-semibold font-mono text-xs text-primary">{sub.id}</TableCell>
                  <TableCell className="font-serif font-bold text-slate-900 dark:text-white hover:underline cursor-pointer">
                    <p className="line-clamp-1">{sub.title}</p>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">{sub.journalTitle}</TableCell>
                  <TableCell>{new Date(sub.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[sub.status] as any} className="font-bold capitalize">
                      {sub.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* SUBMISSION WIZARD MODAL */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Manuscript Submission Wizard"
        size="lg"
      >
        <div className="flex flex-col gap-6 font-sans">
          
          {/* Progress dots */}
          <div className="flex justify-between items-center px-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-grow last:flex-grow-0">
                <div className={`h-8 w-8 rounded-full font-semibold text-xs flex items-center justify-center border-2 ${
                  wizardStep === step 
                    ? 'bg-[#8B0000] border-[#8B0000] text-white' 
                    : (wizardStep > step ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400')
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`h-0.5 flex-grow mx-2 ${
                    wizardStep > step ? 'bg-emerald-500' : 'bg-slate-100'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleWizardSubmit} className="flex flex-col gap-4 mt-2">
            
            {/* STEP 1: METADATA */}
            {wizardStep === 1 && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Step 1: Manuscript Details</h4>
                <Input
                  label="Manuscript Title"
                  placeholder="A Novel Analysis on quantum computing in therapeutics..."
                  value={title}
                  onChange={(e: any) => setTitle(e.target.value)}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Manuscript Abstract</label>
                  <textarea
                    placeholder="Provide a comprehensive summary of your research objectives, methodologies, and findings..."
                    value={abstract}
                    onChange={(e: any) => setAbstract(e.target.value)}
                    required
                    className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <Input
                  label="Keywords (Comma-separated)"
                  placeholder="Quantum, Cancer, Immunology"
                  value={keywords}
                  onChange={(e: any) => setKeywords(e.target.value)}
                />
                <Button variant="secondary" type="button" className="ml-auto bg-[#8B0000]" onClick={() => setWizardStep(2)}>
                  Next Step <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            )}

            {/* STEP 2: JOURNAL SELECT */}
            {wizardStep === 2 && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Step 2: Choose Target Journal</h4>
                <Select
                  label="Target Scientific Journal"
                  options={['', ...db.journals.map((j: Journal) => ({ value: j.id, label: j.title }))]}
                  value={selectedJournalId}
                  onChange={(e: any) => setSelectedJournalId(e.target.value)}
                  required
                />
                <Card variant="flat" className="p-4 bg-slate-50 text-xs text-slate-500 leading-relaxed">
                  Before choosing a journal, verify that your manuscript aligns with the scope described on the journal details page. Submitted work is subjected to strict anti-plagiarism screening.
                </Card>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" type="button" onClick={() => setWizardStep(1)}>Previous</Button>
                  <Button variant="secondary" type="button" className="bg-[#8B0000]" disabled={!selectedJournalId} onClick={() => setWizardStep(3)}>
                    Next Step <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: CO-AUTHORS LIST */}
            {wizardStep === 3 && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Step 3: Register Co-Authors</h4>
                
                {/* Co-author quick additions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                  <Input placeholder="Name" value={authorName} onChange={(e: any) => setAuthorName(e.target.value)} />
                  <Input placeholder="Email" type="email" value={authorEmail} onChange={(e: any) => setAuthorEmail(e.target.value)} />
                  <Input placeholder="Affiliation" value={authorAff} onChange={(e: any) => setAuthorAff(e.target.value)} />
                  <Button variant="outline" type="button" onClick={handleAddCoAuthor} className="md:col-span-3 mt-1.5">
                    <UserPlus className="h-4 w-4 mr-1.5" /> Add Author to Manuscript
                  </Button>
                </div>

                {/* Added Co-authors listing */}
                {coAuthors.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-xs font-bold text-slate-500">Co-Authors registered for publication:</p>
                    {coAuthors.map((ca: ArticleAuthor, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg text-xs">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{ca.name}</p>
                          <p className="text-slate-400 mt-0.5">{ca.affiliation} ({ca.email})</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveCoAuthor(idx)} className="text-rose-500 p-0 h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" type="button" onClick={() => setWizardStep(2)}>Previous</Button>
                  <Button variant="secondary" type="button" className="bg-[#8B0000]" onClick={() => setWizardStep(4)}>
                    Next Step <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: COVER LETTER & SUBMIT */}
            {wizardStep === 4 && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Step 4: Upload & Cover Letter</h4>
                
                {/* Simulated file upload */}
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center flex flex-col items-center gap-3 bg-slate-50 dark:bg-slate-900/30">
                  <Upload className="h-10 w-10 text-slate-400 animate-pulse" />
                  <div>
                    {fileName ? (
                      <p className="text-xs font-bold text-emerald-600">{fileName} uploaded successfully!</p>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Drag & drop your manuscript file here</p>
                        <p className="text-[10px] text-slate-400 mt-1">Acceptable formats: .docx, .doc, .pdf (Max: 20MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={(e: any) => e.target.files[0] && setFileName(e.target.files[0].name)}
                    className="hidden"
                    id="manuscript-file-picker"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button"
                    onClick={() => document.getElementById('manuscript-file-picker')?.click()}
                  >
                    Select File
                  </Button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cover Letter for Editor-in-Chief</label>
                  <textarea
                    placeholder="Introduce your scientific paper, explain its importance, and state why it fits this journal's scope..."
                    value={coverLetter}
                    onChange={(e: any) => setCoverLetter(e.target.value)}
                    required
                    className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" type="button" onClick={() => setWizardStep(3)}>Previous</Button>
                  <Button variant="secondary" type="submit" loading={loading} className="bg-emerald-600 text-white hover:bg-emerald-700">
                    <Send className="h-4 w-4 mr-1.5" /> Submit Paper to Journal
                  </Button>
                </div>
              </div>
            )}

          </form>

        </div>
      </Modal>

    </div>
  );
};
