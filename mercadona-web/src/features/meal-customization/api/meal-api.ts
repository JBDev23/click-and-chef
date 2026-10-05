import { apiClient } from '@/lib/api-client';
import type {
  Complement,
  MealConfiguration,
  MealPrice,
  ProductRole,
} from '@/features/meal-customization/types/meal';

export async function fetchComplements(
  role: ProductRole,
  signal?: AbortSignal,
): Promise<Complement[]> {
  const { data } = await apiClient.get<Complement[]>('/products', {
    params: { role },
    signal,
  });
  return data;
}

export async function quoteMeal(
  dishId: number,
  configuration: MealConfiguration,
  signal?: AbortSignal,
): Promise<MealPrice> {
  const payload = {
    ingredients: configuration.ingredients,
    quantity: configuration.quantity,
    ...(configuration.drinkProductId != null
      ? { drinkProductId: configuration.drinkProductId }
      : {}),
    ...(configuration.dessertProductId != null
      ? { dessertProductId: configuration.dessertProductId }
      : {}),
  };

  const { data } = await apiClient.post<MealPrice>(`/dishes/${dishId}/quote`, payload, {
    signal,
  });
  return data;
}
