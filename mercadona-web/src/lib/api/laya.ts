import { apiClient } from '@/lib/api/client';
import type { LayaRecipeResponse } from '@/lib/api/types';

export async function fetchLayaRecipe(message: string): Promise<LayaRecipeResponse> {
  const { data } = await apiClient.post<LayaRecipeResponse>(
    '/api/laya/recipe',
    { message },
    { timeout: 120_000 },
  );
  return data;
}
