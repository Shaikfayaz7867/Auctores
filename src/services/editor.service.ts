import { useDBStore } from '../store/dbStore';
import { EditorProfile } from '../types';

const LATENCY = 300;

export const editorService = {
  getEditors: async (search?: string): Promise<EditorProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getEditors } = useDBStore.getState();
    let list = [...getEditors()];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => 
        e.name.toLowerCase().includes(q) ||
        e.affiliation.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.specialties.some((s: string) => s.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getEditorById: async (id: string): Promise<EditorProfile | null> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getEditorById } = useDBStore.getState();
    return getEditorById(id) || null;
  },

  getEditorByUserId: async (userId: string): Promise<EditorProfile | null> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const { getEditorByUserId } = useDBStore.getState();
    return getEditorByUserId(userId) || null;
  },

  updateProfile: async (id: string, updatedFields: Partial<EditorProfile>): Promise<EditorProfile> => {
    await new Promise(resolve => setTimeout(resolve, LATENCY + 100));
    const { updateEditorProfile, getEditorById } = useDBStore.getState();
    updateEditorProfile(id, updatedFields);
    return getEditorById(id)!;
  }
};
