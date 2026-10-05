import { CustomizeMealScreen } from '@/features/meal-customization/components/CustomizeMealScreen';
import { parseServingsFromIdea } from '@/features/dishes/utils/dish-presentation';

type CustomizePageProps = {
  params: Promise<{ dishId: string }>;
  searchParams: Promise<{ idea?: string; servings?: string }>;
};

export default async function CustomizePage({ params, searchParams }: CustomizePageProps) {
  const { dishId: dishIdParam } = await params;
  const query = await searchParams;
  const dishId = Number(dishIdParam);
  const idea = query.idea?.trim() || 'Pasta para 4';
  const servingsFromQuery = Number(query.servings);
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
