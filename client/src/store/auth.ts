import { create } from 'zustand';
import type { User } from '@/types';
import { fetchMe, loginWithMicrosoft as apiLoginWithMicrosoft } from '@/api/auth';
import { msalInstance, loginRequest } from '@/lib/msal';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  bootstrap: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  patchUser: (patch: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
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
  loginWithMicrosoft: async () => {
    set({ loading: true });
    try {
      // Mở popup login Microsoft -> trả về ID token đã được Microsoft ký.
      const result = await msalInstance.loginPopup(loginRequest);
      if (!result.idToken) {
        throw new Error('Microsoft không trả về ID token.');
      }
      const res = await apiLoginWithMicrosoft(result.idToken);
      localStorage.setItem('accessToken', res.accessToken);
      set({ user: res.user });
    } finally {
      set({ loading: false });
    }
  },
  patchUser: (patch) =>
    set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
  refreshUser: async () => {
    try {
      const user = await fetchMe();
      set({ user });
    } catch {
      // giữ nguyên state nếu refresh thất bại
    }
  },
  logout: async () => {
    localStorage.removeItem('accessToken');
    set({ user: null });
    // Best-effort: đăng xuất khỏi MSAL cache. Bỏ qua nếu user chưa từng đăng nhập MS phiên này.
    try {
      const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];
      if (account) {
        await msalInstance.logoutPopup({
          account,
          postLogoutRedirectUri: window.location.origin,
        });
      }
    } catch {
      // ignore — popup bị block hoặc user huỷ; token app đã xoá nên trạng thái đã sạch.
    }
  },
}));
