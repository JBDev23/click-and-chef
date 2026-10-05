'use client';

import { useSearchParams } from 'next/navigation';
import { DishCatalog } from '@/features/dishes/components/DishCatalog';

export function DishCatalogRoute() {
  const searchParams = useSearchParams();
  const idea = searchParams.get('idea')?.trim() || 'Pasta para 4';
  const servingsParam = searchParams.get('servings') ?? undefined;

  return <DishCatalog idea={idea} servingsParam={servingsParam} />;
}
