import { api } from './client';
import type { User } from '@/types';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export async function register(input: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', input);
  return data;
}

export async function login(input: { emailOrUsername: string; password: string }): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', input);
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
}
