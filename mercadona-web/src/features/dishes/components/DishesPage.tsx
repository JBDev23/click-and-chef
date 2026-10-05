'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { MercadonaHeader } from '@/features/home/components/MercadonaHeader';
import { listDishes } from '@/lib/api/dishes';
import { formatEuro } from '@/lib/format';
import { queryKeys } from '@/lib/query-keys';

export function DishesPage() {
  const searchParams = useSearchParams();
  const idea = searchParams.get('idea')?.trim() || null;

  const dishesQuery = useQuery({
    queryKey: queryKeys.dishes,
    queryFn: listDishes,
  });

  return (
    <div className="min-h-screen bg-white">
      <MercadonaHeader />
      <main className="home-shell py-8 pb-16">
        <p className="text-[12px] font-medium tracking-[0.18em] text-home-green">
          LISTO PARA RECOGER
        </p>
        <h1 className="mt-2 text-[32px] font-medium text-home-ink sm:text-[40px]">
          Elige tu plato
        </h1>
        {idea ? (
          <p className="mt-2 text-[16px] text-home-muted">
            Basado en tu idea: “{idea}”.
          </p>
        ) : (
          <p className="mt-2 text-[16px] text-home-muted">
            Personaliza ingredientes, bebida y postre. Lo preparamos al momento.
          </p>
        )}

        {dishesQuery.isLoading ? (
          <p className="mt-10 text-home-muted">Cargando platos…</p>
        ) : null}

        {dishesQuery.isError ? (
          <div className="mt-10 rounded-[12px] border border-red-200 bg-red-50 p-4 text-red-800">
            No se pudieron cargar los platos. Comprueba que el backend esté en marcha.
          </div>
        ) : null}

        {dishesQuery.data ? (
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dishesQuery.data.map((dish) => (
              <li key={dish.id}>
                <Link
                  href={`/platos/${dish.id}`}
                  className="flex h-full flex-col overflow-hidden rounded-[16px] border border-home-border bg-home-panel transition hover:border-home-accent"
                >
                  <div className="flex h-44 items-center justify-center bg-[#e7f6ee]">
                    {dish.imageUrl ? (
                      // External catalog URLs vary; avoid next/image domain allowlist friction.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={dish.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[48px] font-medium text-home-green/40">
                        {dish.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-[20px] font-medium text-home-ink">{dish.name}</h2>
                    {dish.description ? (
                      <p className="mt-2 line-clamp-2 text-[14px] text-home-muted">
                        {dish.description}
                      </p>
                    ) : null}
                    <p className="mt-auto pt-4 text-[18px] font-medium text-home-green">
                      desde {formatEuro(dish.basePrice, dish.currency)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {dishesQuery.data?.length === 0 ? (
          <p className="mt-10 text-home-muted">No hay platos disponibles ahora mismo.</p>
        ) : null}
      </main>
    </div>
  );
}
