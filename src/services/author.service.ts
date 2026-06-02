import { useDBStore } from '../store/dbStore';
import { AuthorProfile } from '../types';

const LATENCY = 300;

export const authorService = {
  getAuthors: async (search?: string): Promise<AuthorProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getAuthors } = useDBStore.getState();
    let list = [...getAuthors()];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => 
        a.name.toLowerCase().includes(q) ||
        a.biography.toLowerCase().includes(q) ||
        a.affiliation.toLowerCase().includes(q) ||
        a.researchInterests.some((i: string) => i.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getAuthorById: async (id: string): Promise<AuthorProfile | null> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getAuthorById } = useDBStore.getState();
    return getAuthorById(id) || null;
  },

  getAuthorByUserId: async (userId: string): Promise<AuthorProfile | null> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getAuthorByUserId } = useDBStore.getState();
    return getAuthorByUserId(userId) || null;
  },

  updateProfile: async (id: string, updatedFields: Partial<AuthorProfile>): Promise<AuthorProfile> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 100));
    const { updateAuthorProfile, getAuthorById } = useDBStore.getState();
    updateAuthorProfile(id, updatedFields);
    return getAuthorById(id)!;
  }
};
