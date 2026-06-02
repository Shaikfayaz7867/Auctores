import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Clock, BookOpen, Star, MessageSquare, 
  Send, AlertCircle, FileText, Sparkles, Plus 
} from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import { useAuthStore } from '../../store/authStore';
import { useDBStore } from '../../store/dbStore';
import { Submission, ReviewRound, ReviewerProfile } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';

export const ReviewerDashboard = () => {
  const { user } = useAuthStore();
  const { db } = useDBStore();

  const [activeReviews, setActiveReviews] = useState<Submission[]>([]);
  const [completedReviews, setCompletedReviews] = useState<Submission[]>([]);
  const [profile, setProfile] = useState<ReviewerProfile | null>(null);

  // REVIEW FORM STATE
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [recommendation, setRecommendation] = useState<'accept' | 'minor_revision' | 'major_revision' | 'reject'>('accept');
  const [commentsForAuthor, setCommentsForAuthor] = useState('');
  const [commentsForEditor, setCommentsForEditor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const loadReviewerData = async () => {
        const revId = `rev-${user.id.split('-').pop()}`;
        const { active, completed } = await dashboardService.getSubmissionsByReviewer(revId);
        setActiveReviews(active);
        setCompletedReviews(completed);

        const revProfile = db.reviewers.find((r: ReviewerProfile) => r.userId === user.id);
        setProfile(revProfile || null);
      };
      loadReviewerData();
    }
  }, [user, db.submissions, db.reviewers]);

  const handleOpenForm = (sub: Submission) => {
    setSelectedSub(sub);
    setIsFormOpen(true);
    setRating(5);
    setRecommendation('accept');
    setCommentsForAuthor('');
    setCommentsForEditor('');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !user) return;

    setLoading(true);
    const reviewerId = `rev-${user.id.split('-').pop()}`;

    const reviewData = {
      reviewerId,
      reviewerName: user.name,
      rating,
      recommendation,
      commentsForAuthor,
      commentsForEditor
    };

    try {
      await dashboardService.submitReview(selectedSub.id, reviewData);
      setIsFormOpen(false);
      setSelectedSub(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col gap-8 font-sans">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white">Reviewer Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Review scientific submissions assigned to your subject specialties</p>
        </div>
        {profile && (
          <Badge variant="primary" className="px-4 py-1.5 font-bold uppercase tracking-wider text-xs">
            H-Index: {profile.hIndex}
          </Badge>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Assigned Reviews</span>
            <Clock className="h-4 w-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{activeReviews.length}</p>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Reviews</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-sans mt-2">{profile ? profile.completedReviewsCount : completedReviews.length}</p>
        </Card>

        <Card variant="glass" className="p-5 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Expertise Fields</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex flex-wrap gap-1 mt-2.5">
            {profile?.expertise.map((exp: string) => (
              <Badge key={exp} variant="neutral" className="text-[10px]">{exp}</Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Submissions assigned */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif text-lg font-bold text-primary dark:text-white">Assigned Active Critiques</h3>
        {activeReviews.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950">
            <BookOpen className="h-12 w-12 text-slate-300 animate-pulse" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">Your critique queue is clear</p>
            <p className="text-xs text-slate-400 max-w-xs">No section editors have assigned review evaluations to you at this moment.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manuscript ID</TableHead>
                <TableHead className="w-1/2">Manuscript Title</TableHead>
                <TableHead>Subject Area</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeReviews.map((sub: Submission) => {
                return (
                  <TableRow key={sub.id}>
                    <TableCell className="font-semibold font-mono text-xs text-primary">{sub.id}</TableCell>
                    <TableCell className="font-serif font-bold text-slate-900 dark:text-white">{sub.title}</TableCell>
                    <TableCell>
                      <Badge variant="neutral" className="text-[10px] uppercase font-bold py-0">{sub.journalTitle.split(' ').pop()}</Badge>
                    </TableCell>
                    <TableCell>{new Date(sub.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="secondary" size="sm" onClick={() => handleOpenForm(sub)} className="bg-[#8B0000]">
                        <Star className="h-3.5 w-3.5 mr-1" /> Critique Form
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Historical Reviews completed */}
      {completedReviews.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="font-serif text-lg font-bold text-slate-500">Historical Peer Reviews</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manuscript ID</TableHead>
                <TableHead className="w-1/2">Manuscript Title</TableHead>
                <TableHead>Journal</TableHead>
                <TableHead>Evaluation Score</TableHead>
                <TableHead>Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedReviews.map((sub: Submission) => {
                const myReview = sub.reviews.find((r: ReviewRound) => r.reviewerId === `rev-${user!.id.split('-').pop()}`);
                return (
                  <TableRow key={sub.id}>
                    <TableCell className="font-semibold font-mono text-xs text-slate-400">{sub.id}</TableCell>
                    <TableCell className="font-serif text-slate-600 dark:text-slate-400 leading-snug">{sub.title}</TableCell>
                    <TableCell className="text-xs text-slate-400 font-medium">{sub.journalTitle}</TableCell>
                    <TableCell>
                      <span className="font-bold text-amber-500 font-sans">{myReview ? `${myReview.rating} / 5` : 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={myReview?.recommendation === 'accept' ? 'success' : 'error'} className="font-bold uppercase tracking-wider text-[10px]">
                        {myReview ? myReview.recommendation.replace('_', ' ') : 'N/A'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* CRITIQUE EVALUATION PANEL MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={`Critique Evaluation: ${selectedSub?.id}`}
        size="lg"
      >
        {selectedSub && (
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-5 font-sans text-xs">
            
            <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
              <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white">{selectedSub.title}</h4>
              <p className="text-[10px] text-slate-400">Journal: {selectedSub.journalTitle}</p>
            </div>

            {/* Critique inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Overall Quality Score (1-5)"
                options={['5', '4', '3', '2', '1']}
                value={rating.toString()}
                onChange={(e: any) => setRating(parseInt(e.target.value))}
              />

              <Select
                label="Recommendation Decision"
                options={[
                  { value: 'accept', label: 'Accept for Publication' },
                  { value: 'minor_revision', label: 'Minor Revision Required' },
                  { value: 'major_revision', label: 'Major Revision Required' },
                  { value: 'reject', label: 'Decline / Reject Manuscript' }
                ]}
                value={recommendation}
                onChange={(e: any) => setRecommendation(e.target.value as any)}
              />
            </div>

            {/* Comments for authors */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Comments / Critique for Authors</label>
              <textarea
                placeholder="Write your constructive criticisms and review analysis for the authors. Point out sections, equations, or references requiring updates..."
                value={commentsForAuthor}
                onChange={(e: any) => setCommentsForAuthor(e.target.value)}
                required
                className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            {/* Comments for editors */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confidential Comments for Editors</label>
              <textarea
                placeholder="Write private disclosures, explanations, or recommendations regarding publication suitability that should remain hidden from authors..."
                value={commentsForEditor}
                onChange={(e: any) => setCommentsForEditor(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 border rounded-lg text-slate-400 flex items-start gap-2 leading-relaxed">
              <AlertCircle className="h-4 w-4 text-[#8B0000] flex-shrink-0 mt-0.5" />
              <span>By submitting this critique form, you verify that you have assessed the manuscript scientifically, have no conflicts of interest, and agree to log your review index.</span>
            </div>

            <div className="flex justify-end items-center gap-2 mt-2">
              <Button variant="outline" type="button" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button variant="secondary" type="submit" loading={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="h-4 w-4 mr-1.5" /> Submit Critique Logs
              </Button>
            </div>

          </form>
        )}
      </Modal>

    </div>
  );
};
