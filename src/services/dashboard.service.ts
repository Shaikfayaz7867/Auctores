import { useDBStore } from '../store/dbStore';
import { Submission, ReviewRound, AppNotification } from '../types';

const LATENCY = 400;

export const dashboardService = {
  // Author actions
  getSubmissionsByAuthor: async (authorId: string): Promise<Submission[]> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getSubmissions } = useDBStore.getState();
    return getSubmissions().filter((s: Submission) => s.authorId === authorId);
  },

  submitManuscript: async (submissionData: Omit<Submission, 'id' | 'submittedAt' | 'status' | 'reviews' | 'reviewers'>): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 300));
    const { addSubmission, addNotification } = useDBStore.getState();

    const submission: Submission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      reviews: [],
      reviewers: []
    };

    addSubmission(submission);

    // Notify author
    addNotification({
      userId: submission.authorId,
      title: 'Manuscript Submitted Successfully',
      message: `Your manuscript "${submission.title.substring(0, 45)}..." has been received.`,
      type: 'success',
      link: `/dashboard/author`
    });

    return submission;
  },

  submitRevision: async (id: string, updatedFields: Partial<Submission>): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 200));
    const { updateSubmission, getSubmissionById, addNotification } = useDBStore.getState();

    updateSubmission(id, {
      ...updatedFields,
      status: 'revised'
    });

    const sub = getSubmissionById(id)!;

    // Notify Author
    addNotification({
      userId: sub.authorId,
      title: 'Revision Submitted',
      message: `Revision for manuscript "${sub.title.substring(0, 35)}..." has been uploaded.`,
      type: 'success',
      link: `/dashboard/author`
    });

    return sub;
  },

  // Reviewer actions
  getSubmissionsByReviewer: async (reviewerId: string): Promise<{ active: Submission[]; completed: Submission[] }> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getSubmissions } = useDBStore.getState();
    const list = getSubmissions().filter((s: Submission) => s.reviewers.includes(reviewerId));

    const active: Submission[] = [];
    const completed: Submission[] = [];

    list.forEach((s: Submission) => {
      const hasReviewed = s.reviews.some((r: ReviewRound) => r.reviewerId === reviewerId);
      if (hasReviewed) {
        completed.push(s);
      } else {
        active.push(s);
      }
    });

    return { active, completed };
  },

  submitReview: async (submissionId: string, review: Omit<ReviewRound, 'submittedAt'>): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 200));
    const { updateSubmission, getSubmissionById, addNotification, updateReviewerProfile, getReviewerById } = useDBStore.getState();

    const sub = getSubmissionById(submissionId)!;
    
    const newReview: ReviewRound = {
      ...review,
      submittedAt: new Date().toISOString()
    };

    const nextReviews = [...sub.reviews, newReview];
    
    // Auto shift status to revision required or keep under review depending on count
    const nextStatus = nextReviews.length >= 2 ? 'revision_required' : 'under_peer_review';

    updateSubmission(submissionId, {
      reviews: nextReviews,
      status: nextStatus as Submission['status']
    });

    // Increment completed reviews count for reviewer
    const revProfile = getReviewerById(review.reviewerId);
    if (revProfile) {
      updateReviewerProfile(review.reviewerId, {
        completedReviewsCount: revProfile.completedReviewsCount + 1,
        activeReviewsCount: Math.max(0, revProfile.activeReviewsCount - 1)
      });
    }

    // Notify Author
    addNotification({
      userId: sub.authorId,
      title: 'Peer Review Received',
      message: `A peer review has been submitted for "${sub.title.substring(0, 35)}...".`,
      type: 'info',
      link: `/dashboard/author`
    });

    return getSubmissionById(submissionId)!;
  },

  // Editor actions
  getEditorQueue: async (editorId: string): Promise<Submission[]> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getSubmissions, getEditorById } = useDBStore.getState();
    const editor = getEditorById(editorId);
    if (!editor) return [];

    // Filter submissions matching editor's assigned journals
    return getSubmissions().filter((s: Submission) => editor.assignedJournals.includes(s.journalId));
  },

  assignReviewer: async (submissionId: string, reviewerId: string): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 100));
    const { updateSubmission, getSubmissionById, updateReviewerProfile, getReviewerById, addNotification } = useDBStore.getState();

    const sub = getSubmissionById(submissionId)!;
    const nextReviewers = [...sub.reviewers, reviewerId];

    updateSubmission(submissionId, {
      reviewers: nextReviewers,
      status: 'under_peer_review'
    });

    // Increment reviewer's active count
    const revProfile = getReviewerById(reviewerId);
    if (revProfile) {
      updateReviewerProfile(reviewerId, {
        activeReviewsCount: revProfile.activeReviewsCount + 1
      });
    }

    // Notify Reviewer
    addNotification({
      userId: `usr-reviewer-${reviewerId.split('-').pop()}`, // Link to user account
      title: 'New Review Invitation',
      message: `You have been assigned to review manuscript "${sub.title.substring(0, 35)}...".`,
      type: 'submission',
      link: `/dashboard/reviewer`
    });

    return getSubmissionById(submissionId)!;
  },

  makeEditorialDecision: async (
    submissionId: string, 
    decision: { editorId: string; editorName: string; decision: 'accept' | 'minor_revision' | 'major_revision' | 'reject'; comments: string }
  ): Promise<Submission> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 300));
    const { updateSubmission, getSubmissionById, addNotification, addArticle } = useDBStore.getState();

    const sub = getSubmissionById(submissionId)!;
    const statusMap = {
      accept: 'accepted',
      minor_revision: 'revision_required',
      major_revision: 'revision_required',
      reject: 'rejected'
    };

    const nextStatus = statusMap[decision.decision] as Submission['status'];

    updateSubmission(submissionId, {
      status: nextStatus,
      editorialDecision: {
        ...decision,
        decidedAt: new Date().toISOString()
      }
    });

    // If accepted, programmatically publish as an Article in the journal!
    if (decision.decision === 'accept') {
      const year = new Date().getFullYear();
      const articleId = `art-pub-${Date.now()}`;
      
      const newArticle = {
        id: articleId,
        journalId: sub.journalId,
        journalTitle: sub.journalTitle,
        title: sub.title,
        slug: sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        abstract: sub.abstract,
        authors: sub.authors,
        publicationDate: new Date().toISOString(),
        doi: `10.3390/auctores.${sub.journalId}.${year}.${Math.floor(Math.random() * 9000 + 1000)}`,
        volume: 1, // mock
        issue: 1,
        pages: '1-15',
        keywords: sub.keywords,
        pdfUrl: `/files/auctores-${articleId}.pdf`,
        references: [
          'Foundational reference 1.',
          'Foundational reference 2.'
        ],
        citations: 0,
        views: 0,
        downloads: 0,
        status: 'published' as const,
        license: 'CC BY 4.0 (Creative Commons Attribution License)'
      };

      addArticle(newArticle);
    }

    // Notify author
    addNotification({
      userId: sub.authorId,
      title: `Editorial Decision: ${decision.decision.toUpperCase().replace('_', ' ')}`,
      message: `The editors have made a decision on "${sub.title.substring(0, 35)}...".`,
      type: decision.decision === 'accept' ? 'success' : (decision.decision === 'reject' ? 'error' : 'warning'),
      link: `/dashboard/author`
    });

    return getSubmissionById(submissionId)!;
  }
};
