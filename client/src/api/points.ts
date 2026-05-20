import { api } from './client';
import type { PointsSummary } from '@/types';

export interface MyPointsParams {
  page?: number;
  limit?: number;
}

export async function getMyPoints(params: MyPointsParams = {}): Promise<PointsSummary> {
  const { data } = await api.get<PointsSummary>('/points/me', { params });
  return data;
}
