import { api } from './client';
import type { ListResponse } from '@/types';

export interface CommentAuthor {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

export interface CommentReply {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  user: CommentAuthor;
  isDeleted: boolean;
  canDelete: boolean;
}

export interface CommentItem extends CommentReply {
  replies: CommentReply[];
}

export type CommentSort = 'newest' | 'oldest';

export interface ListCommentsParams {
  documentId: string;
  sort?: CommentSort;
  page?: number;
  limit?: number;
}

export async function listComments({
  documentId,
  ...params
}: ListCommentsParams): Promise<ListResponse<CommentItem>> {
  const { data } = await api.get<ListResponse<CommentItem>>(
    `/documents/${documentId}/comments`,
    { params },
  );
  return data;
}

export async function createComment(
  documentId: string,
  content: string,
  parentId?: string,
): Promise<CommentItem> {
  const { data } = await api.post<{ comment: CommentItem }>(
    `/documents/${documentId}/comments`,
    { content, parentId },
  );
  return data.comment;
}

export async function deleteComment(
  documentId: string,
  commentId: string,
): Promise<void> {
  await api.delete(`/documents/${documentId}/comments/${commentId}`);
}
