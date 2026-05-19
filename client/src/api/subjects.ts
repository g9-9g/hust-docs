import { api } from './client';
import type { Major, Subject } from '@/types';

export async function listMajors(): Promise<Major[]> {
  const { data } = await api.get<{ items: Major[] }>('/majors');
  return data.items;
}

export async function listSubjects(majorId?: string): Promise<Subject[]> {
  const { data } = await api.get<{ items: Subject[] }>('/subjects', { params: { majorId } });
  return data.items;
}
