import { apiClient } from '@/lib/api/client';
import type { Complement, ProductRole } from '@/lib/api/types';

export async function listProductsByRole(
  role: Extract<ProductRole, 'DRINK' | 'DESSERT'>,
): Promise<Complement[]> {
  const { data } = await apiClient.get<Complement[]>('/api/v1/products', {
    params: { role },
  });
  return data;
}
