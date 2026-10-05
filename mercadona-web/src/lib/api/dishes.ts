import { apiClient } from '@/lib/api/client';
import type { DishDetail, DishSummary, MealConfiguration, MealPrice } from '@/lib/api/types';

export async function listDishes(): Promise<DishSummary[]> {
  const { data } = await apiClient.get<DishSummary[]>('/api/v1/dishes');
  return data;
}

export async function getDish(id: number): Promise<DishDetail> {
  const { data } = await apiClient.get<DishDetail>(`/api/v1/dishes/${id}`);
  return data;
}

export async function quoteDish(
  id: number,
  configuration: MealConfiguration,
): Promise<MealPrice> {
  const { data } = await apiClient.post<MealPrice>(
    `/api/v1/dishes/${id}/quote`,
    configuration,
  );
  return data;
}
