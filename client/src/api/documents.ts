import { api, API_BASE_URL } from './client';
import type { DocumentItem, ListResponse } from '@/types';

export interface ListDocumentsParams {
  q?: string;
  subjectId?: string;
  majorId?: string;
  category?: string;
  tag?: string;
  sort?: 'latest' | 'mostDownloaded' | 'mostUpvoted' | 'mostViewed' | 'topRated';
  page?: number;
  limit?: number;
}

export async function listDocuments(params: ListDocumentsParams = {}): Promise<ListResponse<DocumentItem>> {
  const { data } = await api.get<ListResponse<DocumentItem>>('/documents', { params });
  return data;
}

export async function getDocument(id: string): Promise<DocumentItem> {
  const { data } = await api.get<{ document: DocumentItem }>(`/documents/${id}`);
  return data.document;
}

export async function uploadDocument(formData: FormData): Promise<DocumentItem> {
  const { data } = await api.post<{ document: DocumentItem }>('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.document;
}

export interface VoteResult {
  upvoteCount: number;
  downvoteCount: number;
  myVote: 'UP' | 'DOWN' | null;
}

export async function voteDocument(id: string, type: 'UP' | 'DOWN'): Promise<VoteResult> {
  const { data } = await api.post<VoteResult>(`/documents/${id}/vote`, { type });
  return data;
}

export function downloadUrl(id: string) {
  return `${API_BASE_URL}/documents/${id}/download`;
}

export function previewUrl(id: string) {
  return `${API_BASE_URL}/documents/${id}/preview`;
}

export function previewUrlByIndex(id: string, index: number) {
  return `${API_BASE_URL}/documents/${id}/preview/${index}`;
}

export function publicPreviewUrl(id: string): string | null {
  const base = import.meta.env.VITE_PUBLIC_API_BASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, '')}/documents/${id}/preview`;
}
