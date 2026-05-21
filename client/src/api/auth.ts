import { api } from './client';
import type { User } from '@/types';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Đổi ID token Microsoft lấy JWT của app + thông tin user.
export async function loginWithMicrosoft(idToken: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/microsoft', { idToken });
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
}
