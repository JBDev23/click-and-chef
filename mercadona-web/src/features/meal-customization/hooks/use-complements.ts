import { useQuery } from '@tanstack/react-query';
import { fetchComplements } from '@/features/meal-customization/api/meal-api';

export const complementKeys = {
  drinks: ['products', 'DRINK'] as const,
  desserts: ['products', 'DESSERT'] as const,
};

export function useDrinksQuery() {
  return useQuery({
    queryKey: complementKeys.drinks,
    queryFn: ({ signal }) => fetchComplements('DRINK', signal),
  });
}

export function useDessertsQuery() {
  return useQuery({
    queryKey: complementKeys.desserts,
    queryFn: ({ signal }) => fetchComplements('DESSERT', signal),
  });
}
