import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, CheckCircle, Award, Scale, 
  Search, ShieldAlert, AlertCircle, FileText, Send 
} from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import { useAuthStore } from '../../store/authStore';
import { useDBStore } from '../../store/dbStore';
import { Submission, ReviewerProfile } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';

export const EditorDashboard = () => {
  const { user } = useAuthStore();
  const { db } = useDBStore();

  const [queue, setQueue] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  
  // MODALS CONTROL
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);

  // DECISION STATE
  const [decision, setDecision] = useState<'accept' | 'minor_revision' | 'major_revision' | 'reject'>('accept');
  const [decisionComments, setDecisionComments] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const loadEditorQueue = async () => {
        const editorId = `edi-${user.id.split('-').pop()}`;
        const submissionsList = await dashboardService.getEditorQueue(editorId);
        setQueue(submissionsList);
      };
      loadEditorQueue();
    }
  }, [user, db.submissions]);

  const handleOpenAssign = (sub: Submission) => {
    setSelectedSub(sub);
    setIsAssignOpen(true);
  };

  const handleOpenDecision = (sub: Submission) => {
    setSelectedSub(sub);
    setIsDecisionOpen(true);
    setDecision('accept');
    setDecisionComments('');
  };

  const handleAssignReviewer = async (reviewerId: string) => {
    if (!selectedSub) return;
    try {
      await dashboardService.assignReviewer(selectedSub.id, reviewerId);
      // Keep modal open to assign more reviewers if needed, or close
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !user) return;

    setLoading(true);
    const decisionPayload = {
      editorId: `edi-${user.id.split('-').pop()}`,
      editorName: user.name,
      decision,
      comments: decisionComments
    };

    try {
      await dashboardService.makeEditorialDecision(selectedSub.id, decisionPayload);
      setIsDecisionOpen(false);
      setSelectedSub(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter available reviewers who are NOT already assigned to this paper
  const getAvailableReviewers = () => {
    if (!selectedSub) return [];
    return db.reviewers.filter((r: ReviewerProfile) => !selectedSub.reviewers.includes(r.id));
  };

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
      
      {/* Header Panel */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">Editorial Board Desk</h1>
        <p className="text-xs text-slate-500 mt-1">Manage manuscript submissions and oversee rigorous peer evaluations</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Manuscripts in Queue</span>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{queue.length}</p>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Needs Reviewer Assign</span>
            <Users className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{queue.filter((s: Submission) => s.reviewers.length === 0).length}</p>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Under Peer Evaluation</span>
            <BookOpen className="h-4 w-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{queue.filter((s: Submission) => s.status === 'under_peer_review').length}</p>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Decisions Awaiting</span>
            <Award className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{queue.filter((s: Submission) => s.reviews.length >= 2 && s.status !== 'accepted' && s.status !== 'rejected').length}</p>
        </Card>
      </div>

      {/* Manuscript list queue */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif text-lg font-bold text-primary dark:text-white">Editorial Pipeline Queue</h3>
        {queue.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950">
            <FileText className="h-12 w-12 text-slate-300 animate-pulse" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">Active queue is empty</p>
            <p className="text-xs text-slate-400 max-w-xs">No manuscripts are currently assigned to your managed journals.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="w-1/3">Manuscript Title</TableHead>
                <TableHead>Journal</TableHead>
                <TableHead>Reviewers</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Editorial Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((sub: Submission) => {
                return (
                  <TableRow key={sub.id}>
                    <TableCell className="font-semibold font-mono text-xs text-primary">{sub.id}</TableCell>
                    <TableCell className="font-serif font-bold text-slate-900 dark:text-white leading-snug">
                      {sub.title}
                      <p className="text-[10px] font-sans text-slate-400 font-medium mt-1">Submitted by: {sub.authorName}</p>
                    </TableCell>
                    <TableCell className="text-xs font-semibold">{sub.journalTitle.split(' ').pop()}</TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-700 dark:text-slate-300 font-sans">{sub.reviewers.length} / 3</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-emerald-600 font-sans">{sub.reviews.length} completed</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[sub.status] as any} className="font-bold capitalize">
                        {sub.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2 h-16">
                      <Button variant="outline" size="sm" onClick={() => handleOpenAssign(sub)} className="text-xs">
                        Assign ({sub.reviewers.length})
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleOpenDecision(sub)} className="text-xs bg-[#8B0000]">
                        Decision
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* MODAL 1: ASSIGN REVIEWERS PANEL */}
      <Modal
        isOpen={isAssignOpen}
        onClose={() => { setIsAssignOpen(false); setSelectedSub(null); }}
        title={`Assign Peer Reviewers: ${selectedSub?.id}`}
        size="lg"
      >
        {selectedSub && (
          <div className="flex flex-col gap-5 font-sans text-xs">
            
            <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-3">
              <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white">{selectedSub.title}</h4>
              <p className="text-[10px] text-slate-400">Current assigned count: {selectedSub.reviewers.length} reviewer(s)</p>
            </div>

            {/* List of active reviewers */}
            <div className="max-h-80 overflow-y-auto flex flex-col gap-2.5 pr-2">
              {getAvailableReviewers().length === 0 ? (
                <p className="p-4 text-center text-slate-400">All directory reviewers have already been assigned to this manuscript.</p>
              ) : (
                getAvailableReviewers().slice(0, 10).map((reviewer: ReviewerProfile) => (
                  <div key={reviewer.id} className="p-4 border border-slate-100 dark:border-slate-900 rounded-xl flex items-center justify-between gap-4 bg-white dark:bg-slate-950 shadow-sm">
                    <div className="flex gap-3 items-center min-w-0">
                      <img src={reviewer.avatar} alt={reviewer.name} className="h-10 w-10 rounded-full border border-slate-200 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{reviewer.name}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 leading-normal">{reviewer.affiliation}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {reviewer.expertise.map((exp: string) => (
                            <Badge key={exp} variant="neutral" className="text-[8px] py-0">{exp}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold">Active: {reviewer.activeReviewsCount} tasks</span>
                      <Button variant="primary" size="sm" onClick={() => handleAssignReviewer(reviewer.id)} className="h-8 text-[11px]">
                        Assign Review
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
              <Button variant="outline" type="button" onClick={() => { setIsAssignOpen(false); setSelectedSub(null); }}>
                Done / Close
              </Button>
            </div>

          </div>
        )}
      </Modal>

      {/* MODAL 2: EDITORIAL DECISION MAKING */}
      <Modal
        isOpen={isDecisionOpen}
        onClose={() => { setIsDecisionOpen(false); setSelectedSub(null); }}
        title={`Make Editorial Decision: ${selectedSub?.id}`}
        size="lg"
      >
        {selectedSub && (
          <form onSubmit={handleDecisionSubmit} className="flex flex-col gap-5 font-sans text-xs">
            
            <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-3">
              <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white">{selectedSub.title}</h4>
              <p className="text-[10px] text-slate-400">Received peer reports: {selectedSub.reviews.length} evaluation(s)</p>
            </div>

            {/* Peer Reviews evaluations details lists */}
            {selectedSub.reviews.length > 0 && (
              <div className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-900/40 border p-4 rounded-xl max-h-56 overflow-y-auto">
                <p className="font-bold text-slate-700 dark:text-slate-300">Peer reviewer critique reports summary:</p>
                {selectedSub.reviews.map((rep: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-950 border rounded-lg flex flex-col gap-1.5 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-900 pb-1.5">
                      <span className="font-bold text-slate-800 dark:text-white">Reviewer: {rep.reviewerName}</span>
                      <Badge variant={rep.recommendation === 'accept' ? 'success' : 'error'} className="font-bold uppercase text-[9px]">{rep.recommendation.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-slate-500 leading-relaxed font-medium mt-1">" {rep.commentsForEditor} "</p>
                    <p className="text-[10px] text-slate-400 text-right mt-1 font-semibold">Overall Quality: {rep.rating} / 5</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <Select
                label="Editorial Board Decision Verdict"
                options={[
                  { value: 'accept', label: 'Accept and Publish Manuscript' },
                  { value: 'minor_revision', label: 'Request Minor Revision' },
                  { value: 'major_revision', label: 'Request Major Revision' },
                  { value: 'reject', label: 'Decline / Reject Submission' }
                ]}
                value={decision}
                onChange={(e: any) => setDecision(e.target.value as any)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Decision comments & instruction letter</label>
                <textarea
                  placeholder="Provide detailed instructions and summaries explaining the board's decision verdict. Cite reviewer reports and identify required fixes..."
                  value={decisionComments}
                  onChange={(e: any) => setDecisionComments(e.target.value)}
                  required
                  className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-400 flex items-start gap-2 leading-relaxed">
              <Scale className="h-4 w-4 text-[#8B0000] flex-shrink-0 mt-0.5" />
              <span>By recording this editorial decision, you verify that you have evaluated the paper in accordance with COPE ethical guidelines and represent the journal's board.</span>
            </div>

            <div className="flex justify-end items-center gap-2 mt-2">
              <Button variant="outline" type="button" onClick={() => { setIsDecisionOpen(false); setSelectedSub(null); }}>Cancel</Button>
              <Button variant="secondary" type="submit" loading={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="h-4 w-4 mr-1.5" /> Record Decision Verdict
              </Button>
            </div>

          </form>
        )}
      </Modal>

    </div>
  );
};
