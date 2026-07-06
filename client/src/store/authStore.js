import { create } from 'zustand';
import api from '../lib/api';

const TOKEN_KEY = 'wfe_token';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY) || null,
  user: null,
  ready: false, // becomes true once the initial /me check resolves

  isAuthed: () => !!get().token,

  signup: async (email, password) => {
    const { data } = await api.post('/auth/signup', { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    set({ token: data.token, user: data.user });
    return data.user;
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    set({ token: data.token, user: data.user });
    return data.user;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null });
  },

  // Validate the stored token on app load and hydrate the user.
  loadMe: async () => {
    if (!get().token) {
      set({ ready: true });
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, ready: true });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      set({ token: null, user: null, ready: true });
    }
  },
}));

export default useAuthStore;
