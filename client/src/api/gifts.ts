import { api } from './client';
import type { EquipResult, GiftCatalog, RedeemResult, RedemptionsSummary } from '@/types';

export async function getGifts(): Promise<GiftCatalog> {
  const { data } = await api.get<GiftCatalog>('/gifts');
  return data;
}

export async function redeemGift(id: string): Promise<RedeemResult> {
  const { data } = await api.post<RedeemResult>(`/gifts/${id}/redeem`);
  return data;
}

export async function equipCosmetic(
  giftId: string | null,
  slot: 'badge' | 'frame',
): Promise<EquipResult> {
  const { data } = await api.post<EquipResult>('/gifts/equip', { giftId, slot });
  return data;
}

export interface MyRedemptionsParams {
  page?: number;
  limit?: number;
}

export async function getMyRedemptions(
  params: MyRedemptionsParams = {},
): Promise<RedemptionsSummary> {
  const { data } = await api.get<RedemptionsSummary>('/redemptions/me', { params });
  return data;
}
