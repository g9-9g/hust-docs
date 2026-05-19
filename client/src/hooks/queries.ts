import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listMajors, listSubjects } from '@/api/subjects';
import { getDocument, listDocuments, type ListDocumentsParams } from '@/api/documents';
import type { DocumentItem, ListResponse, Major, Subject } from '@/types';

export function useMajorsQuery() {
  return useQuery<Major[]>({
    queryKey: ['majors'],
    queryFn: listMajors,
    staleTime: 5 * 60_000,
  });
}

export function useSubjectsQuery(majorId?: string) {
  return useQuery<Subject[]>({
    queryKey: ['subjects', majorId ?? null],
    queryFn: () => listSubjects(majorId),
    enabled: !!majorId,
    staleTime: 5 * 60_000,
  });
}

export function useDocumentsQuery(params: ListDocumentsParams) {
  return useQuery<ListResponse<DocumentItem>>({
    queryKey: ['documents', params],
    queryFn: () => listDocuments(params),
    placeholderData: keepPreviousData,
  });
}

export function useDocumentQuery(id: string | undefined) {
  return useQuery<DocumentItem>({
    queryKey: ['document', id],
    queryFn: () => getDocument(id!),
    enabled: !!id,
  });
}
