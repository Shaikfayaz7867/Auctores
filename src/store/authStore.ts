import { create } from 'zustand';
import { User } from '../types';
import { useDBStore } from './dbStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeRole: 'author' | 'reviewer' | 'editor' | 'admin' | null;
  
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  register: (data: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  switchRole: (role: 'author' | 'reviewer' | 'editor' | 'admin') => void;
  updateUserAffiliation: (affiliation: string) => void;
}

const LOCAL_SESSION_STORAGE_ID = 'auctores_auth_session';

const getInitialSession = (): { user: User | null; isAuthenticated: boolean; activeRole: AuthState['activeRole'] } => {
  const session = localStorage.getItem(LOCAL_SESSION_STORAGE_ID);
  if (session) {
    try {
      const parsed = JSON.parse(session);
      return {
        user: parsed,
        isAuthenticated: true,
        activeRole: parsed.role,
      };
    } catch {
      localStorage.removeItem(LOCAL_SESSION_STORAGE_ID);
    }
  }
  return {
    user: null,
    isAuthenticated: false,
    activeRole: null,
  };
};

export const useAuthStore = create<AuthState>((set: any, get: any) => ({
  ...getInitialSession(),

  login: async (email: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Find the user in our database
    const db = useDBStore.getState().db;
    const matchedUser = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase().trim());
    
    if (matchedUser) {
      localStorage.setItem(LOCAL_SESSION_STORAGE_ID, JSON.stringify(matchedUser));
      set({
        user: matchedUser,
        isAuthenticated: true,
        activeRole: matchedUser.role,
      });
      return true;
    }
    
    // Default fallback users for demonstration if typed something specific
    // or we can allow logging in as a generic author/editor/reviewer if matches keywords
    const lowerEmail = email.toLowerCase();
    let fallbackUser: User | null = null;
    
    if (lowerEmail.includes('admin')) {
      fallbackUser = db.users.find((u: User) => u.role === 'admin') || null;
    } else if (lowerEmail.includes('editor')) {
      fallbackUser = db.users.find((u: User) => u.role === 'editor') || null;
    } else if (lowerEmail.includes('reviewer')) {
      fallbackUser = db.users.find((u: User) => u.role === 'reviewer') || null;
    } else if (lowerEmail.includes('author') || lowerEmail !== '') {
      fallbackUser = db.users.find((u: User) => u.role === 'author') || null;
    }

    if (fallbackUser) {
      localStorage.setItem(LOCAL_SESSION_STORAGE_ID, JSON.stringify(fallbackUser));
      set({
        user: fallbackUser,
        isAuthenticated: true,
        activeRole: fallbackUser.role,
      });
      return true;
    }

    return false;
  },

  logout: () => {
    localStorage.removeItem(LOCAL_SESSION_STORAGE_ID);
    set({
      user: null,
      isAuthenticated: false,
      activeRole: null,
    });
  },

  register: async (userData: Omit<User, 'id' | 'createdAt'>) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newUser: User = {
      ...userData,
      id: `usr-${userData.role}-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // Add to our reactive database
    const dbStore = useDBStore.getState();
    const updatedUsers = [newUser, ...dbStore.db.users];
    
    // Create profiles if applicable
    if (userData.role === 'author') {
      const newAuthor = {
        id: `aut-${Date.now()}`,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`,
        biography: 'No biography provided yet.',
        affiliation: newUser.affiliation || 'Unassigned',
        hIndex: 0,
        citations: 0,
        orcid: newUser.orcid || '',
        researchInterests: [],
        publications: []
      };
      dbStore.updateAuthorProfile(newAuthor.id, newAuthor);
      // Wait, updateAuthorProfile modifies existing. To write a new author profile:
      // Let's modify dbStore to append it, or we can write directly to db state.
      // But we can just use the dbStore db directly and write to it. Let's do that!
      const nextAuthors = [newAuthor, ...dbStore.db.authors];
      useDBStore.setState({
        db: {
          ...dbStore.db,
          users: updatedUsers,
          authors: nextAuthors
        }
      });
    } else if (userData.role === 'reviewer') {
      const newReviewer = {
        id: `rev-${Date.now()}`,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${newUser.name}`,
        affiliation: newUser.affiliation || 'Unassigned',
        expertise: [],
        completedReviewsCount: 0,
        activeReviewsCount: 0,
        hIndex: 0
      };
      const nextReviewers = [newReviewer, ...dbStore.db.reviewers];
      useDBStore.setState({
        db: {
          ...dbStore.db,
          users: updatedUsers,
          reviewers: nextReviewers
        }
      });
    } else {
      useDBStore.setState({
        db: {
          ...dbStore.db,
          users: updatedUsers
        }
      });
    }

    // Auto-login
    localStorage.setItem(LOCAL_SESSION_STORAGE_ID, JSON.stringify(newUser));
    set({
      user: newUser,
      isAuthenticated: true,
      activeRole: newUser.role,
    });

    return true;
  },

  switchRole: (role: 'author' | 'reviewer' | 'editor' | 'admin') => {
    set({ activeRole: role });
  },

  updateUserAffiliation: (affiliation: string) => set((state: AuthState) => {
    if (!state.user) return {};
    const nextUser = { ...state.user, affiliation };
    localStorage.setItem(LOCAL_SESSION_STORAGE_ID, JSON.stringify(nextUser));
    
    // Update inside list of users
    const dbStore = useDBStore.getState();
    const nextUsers = dbStore.db.users.map((u: User) => u.id === state.user!.id ? nextUser : u);
    
    // Also update corresponding profiles
    if (state.user.role === 'author') {
      const authorProfile = dbStore.getAuthorByUserId(state.user.id);
      if (authorProfile) {
        dbStore.updateAuthorProfile(authorProfile.id, { affiliation });
      }
    } else if (state.user.role === 'reviewer') {
      const revProfile = dbStore.getReviewerByUserId(state.user.id);
      if (revProfile) {
        dbStore.updateReviewerProfile(revProfile.id, { affiliation });
      }
    } else if (state.user.role === 'editor') {
      const edProfile = dbStore.getEditorByUserId(state.user.id);
      if (edProfile) {
        dbStore.updateEditorProfile(edProfile.id, { affiliation });
      }
    }

    useDBStore.setState({
      db: {
        ...dbStore.db,
        users: nextUsers
      }
    });

    return { user: nextUser };
  })
}));
