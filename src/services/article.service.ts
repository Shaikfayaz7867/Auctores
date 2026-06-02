import { useDBStore } from '../store/dbStore';
import { Article } from '../types';

const LATENCY = 350;

export interface ArticleFilters {
  search?: string;
  journalId?: string;
  authorId?: string;
  category?: string;
  section?: string;
  sortBy?: 'publicationDate' | 'citations' | 'views' | 'downloads' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const articleService = {
  getArticles: async (filters: ArticleFilters = {}): Promise<{ articles: Article[]; total: number; pages: number }> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    
    const dbStore = useDBStore.getState();
    let list = [...dbStore.getArticles()];

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.abstract.toLowerCase().includes(q) ||
        a.doi.toLowerCase().includes(q) ||
        a.keywords.some((k: string) => k.toLowerCase().includes(q)) ||
        a.authors.some((auth: any) => auth.name.toLowerCase().includes(q))
      );
    }

    // Journal filter
    if (filters.journalId) {
      list = list.filter(a => a.journalId === filters.journalId);
    }

    // Author filter
    if (filters.authorId) {
      list = list.filter(a => a.authors.some((auth: any) => auth.id === filters.authorId));
    }

    // Category filter
    if (filters.category) {
      const journals = dbStore.getJournals();
      const targetJournalIds = journals
        .filter((j: any) => j.categories.includes(filters.category!))
        .map((j: any) => j.id);
      list = list.filter(a => targetJournalIds.includes(a.journalId));
    }

    // Section filter
    if (filters.section) {
      list = list.filter(a => a.section === filters.section);
    }

    // Sorting
    const sortBy = filters.sortBy || 'publicationDate';
    const sortOrder = filters.sortOrder || 'desc';

    list.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'publicationDate') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginatedList = list.slice(startIndex, startIndex + limit);

    return {
      articles: paginatedList,
      total,
      pages: Math.ceil(total / limit)
    };
  },

  getArticleBySlug: async (slug: string): Promise<Article | null> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getArticleBySlug } = useDBStore.getState();
    return getArticleBySlug(slug) || null;
  },

  getArticleById: async (id: string): Promise<Article | null> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getArticleById } = useDBStore.getState();
    return getArticleById(id) || null;
  },

  incrementStats: async (id: string, type: 'views' | 'downloads'): Promise<void> => {
    // Fire-and-forget stat updates (simulate real tracker)
    const { incrementArticleStats } = useDBStore.getState();
    incrementArticleStats(id, type);
  },

  createArticle: async (article: Article): Promise<Article> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 200));
    const { addArticle } = useDBStore.getState();
    addArticle(article);
    return article;
  }
};
