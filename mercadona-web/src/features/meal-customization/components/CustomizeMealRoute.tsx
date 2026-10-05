'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { CustomizeMealScreen } from '@/features/meal-customization/components/CustomizeMealScreen';
import { parseServingsFromIdea } from '@/features/dishes/utils/dish-presentation';

export function CustomizeMealRoute() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const dishId = Number(params.id);
  const idea = searchParams.get('idea')?.trim() || 'Pasta para 4';
  const servingsFromQuery = Number(searchParams.get('servings'));
  const servings =
    Number.isFinite(servingsFromQuery) && servingsFromQuery >= 1 && servingsFromQuery <= 99
      ? servingsFromQuery
      : parseServingsFromIdea(idea);

  if (!Number.isFinite(dishId) || dishId <= 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#b42318]">
        Plato no válido.
      </div>
    );
  }

  return <CustomizeMealScreen dishId={dishId} idea={idea} servings={servings} />;
}
