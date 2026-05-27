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
    // Full-page redirect tới Microsoft. Hàm này không bao giờ resolve ở phía SPA hiện tại
    // vì browser sẽ navigate đi. Phần xử lý kết quả nằm ở main.tsx (handleRedirectPromise).
    try {
      await msalInstance.loginRedirect(loginRequest);
    } catch (err) {
      set({ loading: false });
      throw err;
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
    // Chỉ xoá cache/account MSAL ở local, KHÔNG gọi logoutRedirect để tránh
    // đăng xuất luôn khỏi tài khoản Microsoft của user.
    try {
      await msalInstance.clearCache();
    } catch {
      // best-effort
    }
    msalInstance.setActiveAccount(null);
  },
}));
