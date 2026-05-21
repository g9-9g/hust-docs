import { api } from './client';
import type { Major, SubjectListItem } from '@/types';

export async function listMajors(): Promise<Major[]> {
  const { data } = await api.get<{ items: Major[] }>('/majors');
  return data.items;
}

export interface ListSubjectsParams {
  majorId?: string;
  q?: string;
}

export async function listSubjects(params: ListSubjectsParams = {}): Promise<SubjectListItem[]> {
  const { data } = await api.get<{ items: SubjectListItem[] }>('/subjects', { params });
  return data.items;
}

export async function getSubject(id: string): Promise<SubjectListItem> {
  const { data } = await api.get<{ subject: SubjectListItem }>(`/subjects/${id}`);
  return data.subject;
}
