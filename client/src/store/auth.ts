import { create } from 'zustand';
import type { User } from '@/types';
import { fetchMe, login as apiLogin, register as apiRegister } from '@/api/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  bootstrap: () => Promise<void>;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (input: { fullName: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  bootstrap: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ initialized: true });
      return;
    }
    try {
      const user = await fetchMe();
      set({ user, initialized: true });
    } catch {
      localStorage.removeItem('accessToken');
      set({ user: null, initialized: true });
    }
  },
  login: async (emailOrUsername, password) => {
    set({ loading: true });
    try {
      const res = await apiLogin({ emailOrUsername, password });
      localStorage.setItem('accessToken', res.accessToken);
      set({ user: res.user });
    } finally {
      set({ loading: false });
    }
  },
  register: async (input) => {
    set({ loading: true });
    try {
      const res = await apiRegister(input);
      localStorage.setItem('accessToken', res.accessToken);
      set({ user: res.user });
    } finally {
      set({ loading: false });
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null });
  },
}));
