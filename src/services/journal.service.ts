import { useDBStore } from '../store/dbStore';
import { Journal } from '../types';

const LATENCY = 400; // Simulated network delay in ms

export interface JournalFilters {
  search?: string;
  category?: string;
  indexing?: string;
  sortBy?: 'title' | 'impactFactor' | 'hIndex' | 'acceptanceRate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const journalService = {
  getJournals: async (filters: JournalFilters = {}): Promise<{ journals: Journal[]; total: number; pages: number }> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    
    const { getJournals } = useDBStore.getState();
    let list = [...getJournals()];

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.description.toLowerCase().includes(q) ||
        j.issnOnline.includes(q) ||
        j.issnPrint.includes(q)
      );
    }

    // Category filter
    if (filters.category) {
      list = list.filter(j => j.categories.includes(filters.category!));
    }

    // Indexing filter
    if (filters.indexing) {
      list = list.filter(j => j.indexing.includes(filters.indexing!));
    }

    // Sorting
    const sortBy = filters.sortBy || 'impactFactor';
    const sortOrder = filters.sortOrder || 'desc';
    
    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        valA = (valA as string).toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 9;
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginatedList = list.slice(startIndex, startIndex + limit);

    return {
      journals: paginatedList,
      total,
      pages: Math.ceil(total / limit)
    };
  },

  getJournalBySlug: async (slug: string): Promise<Journal | null> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getJournalBySlug } = useDBStore.getState();
    return getJournalBySlug(slug) || null;
  },

  getJournalById: async (id: string): Promise<Journal | null> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getJournalById } = useDBStore.getState();
    return getJournalById(id) || null;
  },

  createJournal: async (journal: Journal): Promise<Journal> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 200));
    const { addJournal } = useDBStore.getState();
    addJournal(journal);
    return journal;
  },

  updateJournal: async (id: string, updatedFields: Partial<Journal>): Promise<Journal> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 100));
    const { updateJournal, getJournalById } = useDBStore.getState();
    updateJournal(id, updatedFields);
    return getJournalById(id)!;
  }
};
