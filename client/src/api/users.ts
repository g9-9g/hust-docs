import { api } from './client';
import type { DocumentItem, ListResponse, MyProfile } from '@/types';

export async function getMyProfile(): Promise<MyProfile> {
  const { data } = await api.get<MyProfile>('/users/me/profile');
  return data;
}

export interface MyDocumentsParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'mostDownloaded' | 'mostUpvoted' | 'mostViewed';
}

export async function listMyDocuments(
  params: MyDocumentsParams = {},
): Promise<ListResponse<DocumentItem>> {
  const { data } = await api.get<ListResponse<DocumentItem>>('/users/me/documents', { params });
  return data;
}
