import { useAuthStore } from '../store/authStore';
import { User } from '../types';

export const authService = {
  login: async (email: string): Promise<boolean> => {
    return useAuthStore.getState().login(email);
  },

  logout: async (): Promise<void> => {
    useAuthStore.getState().logout();
  },

  register: async (data: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    return useAuthStore.getState().register(data);
  },

  getCurrentUser: (): User | null => {
    return useAuthStore.getState().user;
  },

  isAuthenticated: (): boolean => {
    return useAuthStore.getState().isAuthenticated;
  },

  switchRole: (role: 'author' | 'reviewer' | 'editor' | 'admin'): void => {
    useAuthStore.getState().switchRole(role);
  },

  updateAffiliation: async (affiliation: string): Promise<void> => {
    useAuthStore.getState().updateUserAffiliation(affiliation);
  }
};
