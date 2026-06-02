export interface User {
  id: string;
  name: string;
  email: string;
  role: 'author' | 'reviewer' | 'editor' | 'admin';
  avatar?: string;
  orcid?: string;
  affiliation?: string;
  createdAt: string;
}

export interface Journal {
  id: string;
  title: string;
  slug: string;
  description: string;
  issnPrint: string;
  issnOnline: string;
  impactFactor: number;
  citeScore: number;
  hIndex: number;
  acceptanceRate: number; // percentage, e.g. 24
  daysToFirstDecision: number;
  frequency: string; // "Monthly", "Quarterly", etc.
  publisher: string;
  categories: string[];
  logo: string;
  coverImage: string;
  indexing: string[];
  editorialPolicy: string;
  articleProcessingCharge: number; // in USD, e.g. 1500
  foundedYear: number;
  editorInChiefId: string;
}

export interface ArticleAuthor {
  id?: string;
  name: string;
  affiliation: string;
  email: string;
  isCorresponding: boolean;
  orcid?: string;
}

export interface Article {
  id: string;
  journalId: string;
  journalTitle: string;
  title: string;
  slug: string;
  abstract: string;
  authors: ArticleAuthor[];
  publicationDate: string;
  doi: string;
  volume: number;
  issue: number;
  pages: string;
  keywords: string[];
  pdfUrl: string;
  references: string[];
  citations: number;
  views: number;
  downloads: number;
  status: 'published' | 'draft' | 'under_review' | 'withdrawn';
  license: string;
  section?: string;
}

export interface AuthorProfile {
  id: string;
  userId?: string;
  name: string;
  email: string;
  avatar: string;
  biography: string;
  affiliation: string;
  hIndex: number;
  citations: number;
  orcid: string;
  researchInterests: string[];
  publications: string[]; // Article IDs
}

export interface EditorProfile {
  id: string;
  userId?: string;
  name: string;
  email: string;
  avatar: string;
  affiliation: string;
  role: 'Editor-in-Chief' | 'Associate Editor' | 'Section Editor' | 'Managing Editor';
  specialties: string[];
  assignedJournals: string[]; // Journal IDs
}

export interface ReviewerProfile {
  id: string;
  userId?: string;
  name: string;
  email: string;
  avatar: string;
  affiliation: string;
  expertise: string[];
  completedReviewsCount: number;
  activeReviewsCount: number;
  hIndex: number;
}

export interface ReviewRound {
  reviewerId: string;
  reviewerName: string;
  rating: number; // 1-5
  recommendation: 'accept' | 'minor_revision' | 'major_revision' | 'reject';
  commentsForAuthor: string;
  commentsForEditor: string;
  submittedAt: string;
}

export interface Submission {
  id: string;
  title: string;
  abstract: string;
  journalId: string;
  journalTitle: string;
  authorId: string;
  authorName: string;
  authors: ArticleAuthor[];
  submittedAt: string;
  status: 'submitted' | 'under_peer_review' | 'revision_required' | 'revised' | 'accepted' | 'rejected' | 'published';
  fileUrl: string;
  fileName: string;
  keywords: string[];
  coverLetter: string;
  reviewers: string[]; // Reviewer IDs assigned
  reviews: ReviewRound[];
  editorialDecision?: {
    editorId: string;
    editorName: string;
    decision: 'accept' | 'minor_revision' | 'major_revision' | 'reject';
    comments: string;
    decidedAt: string;
  };
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'submission';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  journalCount: number;
  icon: string;
}

export interface DailyMetric {
  date: string;
  views: number;
  downloads: number;
  submissions: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalDownloads: number;
  totalSubmissions: number;
  totalPublished: number;
  acceptanceRateAvg: number;
  averageReviewDays: number;
  citationsCount: number;
  dailyMetrics: DailyMetric[];
  viewsByCategory: { category: string; count: number }[];
  submissionsByStatus: { status: string; value: number }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Call for Papers' | 'Event' | 'Policy' | 'Award';
  important: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  quote: string;
  avatar: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Authors' | 'Reviewers' | 'Editors' | 'General';
}
