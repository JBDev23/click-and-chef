'use client';

import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { DishCard } from '@/features/dishes/components/DishCard';
import { useDishesQuery } from '@/features/dishes/hooks/use-dishes';
import {
  buildFlowQuery,
  filterDishesByIdea,
  parseServingsFromIdea,
} from '@/features/dishes/utils/dish-presentation';
import { getErrorMessage } from '@/lib/api-client';

type DishCatalogProps = {
  idea: string;
  servingsParam?: string;
};

export function DishCatalog({ idea, servingsParam }: DishCatalogProps) {
  const dishesQuery = useDishesQuery();
  const servings =
    servingsParam && Number(servingsParam) >= 1 && Number(servingsParam) <= 99
      ? Number(servingsParam)
      : parseServingsFromIdea(idea);

  const dishes = dishesQuery.data ? filterDishesByIdea(dishesQuery.data, idea) : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(900px_420px_at_100%_0%,#e8f6ef_0%,#f7faf8_55%,#fbfbfb_100%)]">
      <div className="home-shell relative py-8 lg:py-10">
        <Link
          href={`/${buildFlowQuery(idea)}`}
          aria-label="Cerrar y volver a la portada"
          className="absolute top-6 right-4 inline-flex size-11 items-center justify-center rounded-full border border-[#d9d9d9] bg-white text-home-ink shadow-sm md:right-8 lg:top-8 min-[1640px]:right-0"
        >
          <X className="size-5" aria-hidden="true" />
        </Link>

        <p className="pr-14 text-[12px] font-medium tracking-[0.16em] text-home-green">
          TE LO DAMOS HECHO
        </p>
        <h1 className="mt-3 max-w-3xl text-[34px] leading-tight font-bold text-home-ink sm:text-[42px]">
          Platos que encajan contigo
        </h1>
        <p className="mt-3 max-w-2xl text-[16px] text-home-muted sm:text-[18px]">
          Para “{idea || 'tu idea'}” hemos encontrado estas opciones preparadas con productos de
          Mercadona.
        </p>

        {idea ? (
          <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-home-border bg-white px-4 py-2 text-[15px] text-home-ink shadow-sm">
            <Search className="size-4 shrink-0 text-home-muted" aria-hidden="true" />
            <span className="truncate">{idea}</span>
          </div>
        ) : null}

        <div className="mt-8">
          {dishesQuery.isLoading ? (
            <p className="text-home-muted">Cargando platos…</p>
          ) : dishesQuery.isError ? (
            <div className="rounded-2xl border border-[#f5c2c0] bg-[#fff5f5] p-5">
              <p className="text-[#b42318]">
                {getErrorMessage(dishesQuery.error, 'No hemos podido cargar el catálogo.')}
              </p>
              <button
                type="button"
                onClick={() => void dishesQuery.refetch()}
                className="mt-3 rounded-full bg-home-green px-4 py-2 text-white"
              >
                Reintentar
              </button>
            </div>
          ) : dishes.length === 0 ? (
            <p className="text-home-muted">No hay platos disponibles ahora mismo.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} idea={idea} servings={servings} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
