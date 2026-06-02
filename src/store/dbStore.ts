import { create } from 'zustand';
import { getLocalDB, saveLocalDB, Database } from '../mocks/db';
import { 
  Journal, Article, AuthorProfile, EditorProfile, 
  ReviewerProfile, Submission, AppNotification, AnalyticsSummary 
} from '../types';

interface DBState {
  db: Database;
  
  // Articles
  getArticles: () => Article[];
  getArticleById: (id: string) => Article | undefined;
  getArticleBySlug: (slug: string) => Article | undefined;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  incrementArticleStats: (id: string, type: 'views' | 'downloads') => void;
  
  // Journals
  getJournals: () => Journal[];
  getJournalById: (id: string) => Journal | undefined;
  getJournalBySlug: (slug: string) => Journal | undefined;
  updateJournal: (id: string, journal: Partial<Journal>) => void;
  addJournal: (journal: Journal) => void;

  // Profiles
  getAuthors: () => AuthorProfile[];
  getAuthorById: (id: string) => AuthorProfile | undefined;
  getAuthorByUserId: (userId: string) => AuthorProfile | undefined;
  updateAuthorProfile: (id: string, profile: Partial<AuthorProfile>) => void;
  
  getEditors: () => EditorProfile[];
  getEditorById: (id: string) => EditorProfile | undefined;
  getEditorByUserId: (userId: string) => EditorProfile | undefined;
  updateEditorProfile: (id: string, profile: Partial<EditorProfile>) => void;
  
  getReviewers: () => ReviewerProfile[];
  getReviewerById: (id: string) => ReviewerProfile | undefined;
  getReviewerByUserId: (userId: string) => ReviewerProfile | undefined;
  updateReviewerProfile: (id: string, profile: Partial<ReviewerProfile>) => void;

  // Submissions
  getSubmissions: () => Submission[];
  getSubmissionById: (id: string) => Submission | undefined;
  addSubmission: (submission: Submission) => void;
  updateSubmission: (id: string, submission: Partial<Submission>) => void;

  // Notifications
  getNotifications: (userId: string) => AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;

  // Reset
  resetDB: () => void;
}

export const useDBStore = create<DBState>((set: any, get: any) => ({
  db: getLocalDB(),

  getArticles: () => get().db.articles,
  getArticleById: (id: string) => get().db.articles.find((a: Article) => a.id === id),
  getArticleBySlug: (slug: string) => get().db.articles.find((a: Article) => a.slug === slug),
  
  addArticle: (article: Article) => set((state: DBState) => {
    const nextArticles = [article, ...state.db.articles];
    const nextDB = { ...state.db, articles: nextArticles };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  updateArticle: (id: string, updatedFields: Partial<Article>) => set((state: DBState) => {
    const nextArticles = state.db.articles.map((a: Article) => a.id === id ? { ...a, ...updatedFields } : a);
    const nextDB = { ...state.db, articles: nextArticles };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  incrementArticleStats: (id: string, type: 'views' | 'downloads') => set((state: DBState) => {
    const nextArticles = state.db.articles.map((a: Article) => {
      if (a.id === id) {
        return {
          ...a,
          views: type === 'views' ? a.views + 1 : a.views,
          downloads: type === 'downloads' ? a.downloads + 1 : a.downloads
        };
      }
      return a;
    });

    // Update global metrics
    const totalViewsDelta = type === 'views' ? 1 : 0;
    const totalDownloadsDelta = type === 'downloads' ? 1 : 0;

    const nextAnalytics: AnalyticsSummary = {
      ...state.db.analytics,
      totalViews: state.db.analytics.totalViews + totalViewsDelta,
      totalDownloads: state.db.analytics.totalDownloads + totalDownloadsDelta,
    };

    const nextDB = { ...state.db, articles: nextArticles, analytics: nextAnalytics };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  getJournals: () => get().db.journals,
  getJournalById: (id: string) => get().db.journals.find((j: Journal) => j.id === id),
  getJournalBySlug: (slug: string) => get().db.journals.find((j: Journal) => j.slug === slug),
  
  updateJournal: (id: string, updatedFields: Partial<Journal>) => set((state: DBState) => {
    const nextJournals = state.db.journals.map((j: Journal) => j.id === id ? { ...j, ...updatedFields } : j);
    const nextDB = { ...state.db, journals: nextJournals };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  addJournal: (journal: Journal) => set((state: DBState) => {
    const nextJournals = [...state.db.journals, journal];
    const nextDB = { ...state.db, journals: nextJournals };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  getAuthors: () => get().db.authors,
  getAuthorById: (id: string) => get().db.authors.find((a: AuthorProfile) => a.id === id),
  getAuthorByUserId: (userId: string) => get().db.authors.find((a: AuthorProfile) => a.userId === userId),
  updateAuthorProfile: (id: string, profile: Partial<AuthorProfile>) => set((state: DBState) => {
    const nextAuthors = state.db.authors.map((a: AuthorProfile) => a.id === id ? { ...a, ...profile } : a);
    const nextDB = { ...state.db, authors: nextAuthors };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  getEditors: () => get().db.editors,
  getEditorById: (id: string) => get().db.editors.find((e: EditorProfile) => e.id === id),
  getEditorByUserId: (userId: string) => get().db.editors.find((e: EditorProfile) => e.userId === userId),
  updateEditorProfile: (id: string, profile: Partial<EditorProfile>) => set((state: DBState) => {
    const nextEditors = state.db.editors.map((e: EditorProfile) => e.id === id ? { ...e, ...profile } : e);
    const nextDB = { ...state.db, editors: nextEditors };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  getReviewers: () => get().db.reviewers,
  getReviewerById: (id: string) => get().db.reviewers.find((r: ReviewerProfile) => r.id === id),
  getReviewerByUserId: (userId: string) => get().db.reviewers.find((r: ReviewerProfile) => r.userId === userId),
  updateReviewerProfile: (id: string, profile: Partial<ReviewerProfile>) => set((state: DBState) => {
    const nextReviewers = state.db.reviewers.map((r: ReviewerProfile) => r.id === id ? { ...r, ...profile } : r);
    const nextDB = { ...state.db, reviewers: nextReviewers };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  getSubmissions: () => get().db.submissions,
  getSubmissionById: (id: string) => get().db.submissions.find((s: Submission) => s.id === id),
  addSubmission: (submission: Submission) => set((state: DBState) => {
    const nextSubmissions = [submission, ...state.db.submissions];
    const nextDB = { ...state.db, submissions: nextSubmissions };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  updateSubmission: (id: string, updatedFields: Partial<Submission>) => set((state: DBState) => {
    const nextSubmissions = state.db.submissions.map((s: Submission) => s.id === id ? { ...s, ...updatedFields } : s);
    const nextDB = { ...state.db, submissions: nextSubmissions };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  getNotifications: (userId: string) => get().db.notifications.filter((n: AppNotification) => n.userId === userId),
  
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => set((state: DBState) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `not-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    const nextNotifs = [newNotif, ...state.db.notifications];
    const nextDB = { ...state.db, notifications: nextNotifs };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  markNotificationRead: (id: string) => set((state: DBState) => {
    const nextNotifs = state.db.notifications.map((n: AppNotification) => n.id === id ? { ...n, read: true } : n);
    const nextDB = { ...state.db, notifications: nextNotifs };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  markAllNotificationsRead: (userId: string) => set((state: DBState) => {
    const nextNotifs = state.db.notifications.map((n: AppNotification) => n.userId === userId ? { ...n, read: true } : n);
    const nextDB = { ...state.db, notifications: nextNotifs };
    saveLocalDB(nextDB);
    return { db: nextDB };
  }),

  resetDB: () => {
    localStorage.removeItem('auctores_platform_db');
    set({ db: getLocalDB() });
  }
}));
