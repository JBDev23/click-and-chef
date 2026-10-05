import { useQuery } from '@tanstack/react-query';
import { fetchDishDetail, fetchDishes } from '@/features/dishes/api/dishes-api';

export const dishKeys = {
  all: ['dishes'] as const,
  lists: () => [...dishKeys.all, 'list'] as const,
  detail: (dishId: number) => [...dishKeys.all, 'detail', dishId] as const,
};

export function useDishesQuery() {
  return useQuery({
    queryKey: dishKeys.lists(),
    queryFn: ({ signal }) => fetchDishes(signal),
  });
}

export function useDishDetailQuery(dishId: number) {
  return useQuery({
    queryKey: dishKeys.detail(dishId),
    queryFn: ({ signal }) => fetchDishDetail(dishId, signal),
    enabled: Number.isFinite(dishId) && dishId > 0,
  });
}
