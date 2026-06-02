import { useDBStore } from '../store/dbStore';
import { AnalyticsSummary, Journal, Article, Submission } from '../types';

const LATENCY = 300;

export const analyticsService = {
  getPlatformAnalytics: async (): Promise<AnalyticsSummary> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { db } = useDBStore.getState();
    return db.analytics;
  },

  getJournalAnalytics: async (journalId: string): Promise<{
    views: number;
    downloads: number;
    submissionsCount: number;
    publishedCount: number;
    impactFactor: number;
    citeScore: number;
    acceptanceRate: number;
    viewsTimeline: { date: string; count: number }[];
  }> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { db } = useDBStore.getState();
    
    const journal = db.journals.find((j: Journal) => j.id === journalId);
    if (!journal) {
      throw new Error(`Journal not found: ${journalId}`);
    }

    const journalArticles = db.articles.filter((a: Article) => a.journalId === journalId);
    const journalSubmissions = db.submissions.filter((s: Submission) => s.journalId === journalId);

    const views = journalArticles.reduce((acc: number, a: Article) => acc + a.views, 0);
    const downloads = journalArticles.reduce((acc: number, a: Article) => acc + a.downloads, 0);

    // Timeline calculations
    const viewsTimeline = db.analytics.dailyMetrics.map((day: any) => ({
      date: day.date,
      count: Math.floor(day.views * (journal.impactFactor / 10)) // scale based on journal premium rank
    }));

    return {
      views,
      downloads,
      submissionsCount: journalSubmissions.length + journalArticles.length,
      publishedCount: journalArticles.length,
      impactFactor: journal.impactFactor,
      citeScore: journal.citeScore,
      acceptanceRate: journal.acceptanceRate,
      viewsTimeline
    };
  }
};
