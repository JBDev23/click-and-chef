import { apiClient } from '@/lib/api-client';
import type { DishDetail, DishSummary } from '@/features/dishes/types/dish';

export async function fetchDishes(signal?: AbortSignal): Promise<DishSummary[]> {
  const { data } = await apiClient.get<DishSummary[]>('/dishes', { signal });
  return data;
}

export async function fetchDishDetail(dishId: number, signal?: AbortSignal): Promise<DishDetail> {
  const { data } = await apiClient.get<DishDetail>(`/dishes/${dishId}`, { signal });
  return data;
}
