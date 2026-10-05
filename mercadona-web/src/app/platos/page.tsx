import { DishCatalog } from '@/features/dishes/components/DishCatalog';

type PlatosPageProps = {
  searchParams: Promise<{ idea?: string; servings?: string }>;
};

export default async function PlatosPage({ searchParams }: PlatosPageProps) {
  const params = await searchParams;
  const idea = params.idea?.trim() || 'Pasta para 4';

  return <DishCatalog idea={idea} servingsParam={params.servings} />;
}
