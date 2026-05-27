import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSubject, listMajors, listSubjects, type ListSubjectsParams } from '@/api/subjects';
import {
  getDocument,
  listDocuments,
  voteDocument,
  type ListDocumentsParams,
} from '@/api/documents';
import { getMyPoints, type MyPointsParams } from '@/api/points';
import {
  createComment,
  deleteComment,
  listComments,
  type CommentItem,
  type CommentSort,
} from '@/api/comments';
import {
  equipCosmetic,
  getGifts,
  getMyRedemptions,
  redeemGift,
  type MyRedemptionsParams,
} from '@/api/gifts';
import type {
  DocumentItem,
  GiftCatalog,
  ListResponse,
  Major,
  PointsSummary,
  RedemptionsSummary,
  SubjectListItem,
} from '@/types';

export function useMajorsQuery() {
  return useQuery<Major[]>({
    queryKey: ['majors'],
    queryFn: listMajors,
    staleTime: 5 * 60_000,
  });
}

export function useSubjectsQuery(majorId?: string) {
  return useQuery<SubjectListItem[]>({
    queryKey: ['subjects', majorId ?? null],
    queryFn: () => listSubjects({ majorId }),
    enabled: !!majorId,
    staleTime: 5 * 60_000,
  });
}

export function useSubjectCatalogQuery(params: ListSubjectsParams = {}) {
  return useQuery<SubjectListItem[]>({
    queryKey: ['subject-catalog', params],
    queryFn: () => listSubjects(params),
    staleTime: 5 * 60_000,
  });
}

export function useSubjectDetailQuery(id: string | undefined) {
  return useQuery<SubjectListItem>({
    queryKey: ['subject', id],
    queryFn: () => getSubject(id!),
    enabled: !!id,
  });
}

export function useDocumentsQuery(params: ListDocumentsParams, enabled = true) {
  return useQuery<ListResponse<DocumentItem>>({
    queryKey: ['documents', params],
    queryFn: () => listDocuments(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useDocumentQuery(id: string | undefined) {
  return useQuery<DocumentItem>({
    queryKey: ['document', id],
    queryFn: () => getDocument(id!),
    enabled: !!id,
  });
}

export function useVoteMutation(documentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: 'UP' | 'DOWN') => voteDocument(documentId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
    },
  });
}

export function useCommentsQuery(
  documentId: string | undefined,
  sort: CommentSort,
  limit: number,
) {
  return useQuery<ListResponse<CommentItem>>({
    queryKey: ['comments', documentId, sort, limit],
    queryFn: () => listComments({ documentId: documentId!, sort, limit }),
    enabled: !!documentId,
    placeholderData: keepPreviousData,
  });
}

export function useCreateCommentMutation(documentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { content: string; parentId?: string }) =>
      createComment(documentId, input.content, input.parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', documentId] });
    },
  });
}

export function useDeleteCommentMutation(documentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(documentId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', documentId] });
    },
  });
}

export function useMyPointsQuery(params: MyPointsParams) {
  return useQuery<PointsSummary>({
    queryKey: ['my-points', params],
    queryFn: () => getMyPoints(params),
    placeholderData: keepPreviousData,
  });
}

export function useGiftsQuery() {
  return useQuery<GiftCatalog>({
    queryKey: ['gifts'],
    queryFn: getGifts,
  });
}

export function useRedeemGiftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (giftId: string) => redeemGift(giftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      queryClient.invalidateQueries({ queryKey: ['my-points'] });
      queryClient.invalidateQueries({ queryKey: ['my-redemptions'] });
    },
  });
}

export function useEquipMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { giftId: string | null; slot: 'badge' | 'frame' }) =>
      equipCosmetic(input.giftId, input.slot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    },
  });
}

export function useMyRedemptionsQuery(params: MyRedemptionsParams) {
  return useQuery<RedemptionsSummary>({
    queryKey: ['my-redemptions', params],
    queryFn: () => getMyRedemptions(params),
    placeholderData: keepPreviousData,
  });
}
