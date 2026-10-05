'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { MercadonaHeader } from '@/features/home/components/MercadonaHeader';
import { PageLoader } from '@/features/shared/components/PageLoader';
import { getDish, quoteDish } from '@/lib/api/dishes';
import { listProductsByRole } from '@/lib/api/products';
import type { Complement, DishDetail, MealConfiguration } from '@/lib/api/types';
import { addDishToCurrentCart } from '@/lib/cart/session';
import { formatEuro, formatQuantity } from '@/lib/format';
import { queryKeys } from '@/lib/query-keys';

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function defaultQuantities(dish: DishDetail): Record<number, number> {
  const defaults: Record<number, number> = {};
  for (const ingredient of dish.ingredients) {
    defaults[ingredient.dishIngredientId] = ingredient.defaultQuantity;
  }
  return defaults;
}

type DishConfiguratorProps = {
  dish: DishDetail;
  drinks: Complement[];
  desserts: Complement[];
};

function DishConfigurator({ dish, drinks, desserts }: DishConfiguratorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [quantities, setQuantities] = useState(() => defaultQuantities(dish));
  const [drinkProductId, setDrinkProductId] = useState<number | null>(null);
  const [dessertProductId, setDessertProductId] = useState<number | null>(null);
  const [servings, setServings] = useState(1);
  const [addError, setAddError] = useState<string | null>(null);

  const configuration = useMemo<MealConfiguration>(
    () => ({
      ingredients: dish.ingredients.map((ingredient) => ({
        dishIngredientId: ingredient.dishIngredientId,
        quantity: quantities[ingredient.dishIngredientId] ?? ingredient.defaultQuantity,
      })),
      drinkProductId,
      dessertProductId,
      quantity: servings,
    }),
    [dish.ingredients, quantities, drinkProductId, dessertProductId, servings],
  );

  const debouncedConfig = useDebouncedValue(configuration, 350);
  const debouncedConfigKey = JSON.stringify(debouncedConfig);

  const quoteQuery = useQuery({
    queryKey: queryKeys.quote(dish.id, debouncedConfigKey),
    queryFn: () => quoteDish(dish.id, debouncedConfig),
  });

  const addMutation = useMutation({
    mutationFn: () => addDishToCurrentCart({ dishId: dish.id, configuration }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      router.push('/carrito');
    },
    onError: (error: Error) => {
      setAddError(error.message || 'No se pudo añadir al carrito.');
    },
  });

  return (
    <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section>
        <h1 className="text-[32px] font-medium text-home-ink sm:text-[40px]">{dish.name}</h1>
        {dish.description ? (
          <p className="mt-2 text-[16px] text-home-muted">{dish.description}</p>
        ) : null}
        <p className="mt-3 text-[18px] text-home-green">
          Precio base {formatEuro(dish.basePrice, dish.currency)} / ración
        </p>

        <h2 className="mt-10 text-[20px] font-medium text-home-ink">Ingredientes</h2>
        <ul className="mt-4 space-y-4">
          {dish.ingredients.map((ingredient) => {
            const value =
              quantities[ingredient.dishIngredientId] ?? ingredient.defaultQuantity;
            return (
              <li
                key={ingredient.dishIngredientId}
                className="rounded-[12px] border border-home-border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-home-ink">{ingredient.name}</p>
                    <p className="mt-1 text-[13px] text-home-muted">
                      Incluido: {formatQuantity(ingredient.defaultQuantity, ingredient.unit)}
                      {' · '}
                      +{formatEuro(ingredient.extraStepPrice)} /{' '}
                      {formatQuantity(ingredient.stepQuantity, ingredient.unit)}
                    </p>
                  </div>
                  <p className="text-[14px] font-medium text-home-ink">
                    {formatQuantity(value, ingredient.unit)}
                  </p>
                </div>
                <input
                  type="range"
                  className="mt-3 w-full accent-home-green"
                  min={ingredient.minQuantity}
                  max={ingredient.maxQuantity}
                  step={ingredient.stepQuantity}
                  value={value}
                  disabled={!ingredient.available}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setQuantities((prev) => ({
                      ...prev,
                      [ingredient.dishIngredientId]: next,
                    }));
                  }}
                />
              </li>
            );
          })}
        </ul>

        <h2 className="mt-10 text-[20px] font-medium text-home-ink">Bebida (opcional)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDrinkProductId(null)}
            className={`rounded-full border px-4 py-2 text-[14px] ${
              drinkProductId === null
                ? 'border-home-green bg-home-green text-white'
                : 'border-home-border text-home-ink'
            }`}
          >
            Sin bebida
          </button>
          {drinks.map((drink) => (
            <button
              key={drink.id}
              type="button"
              onClick={() => setDrinkProductId(drink.id)}
              className={`rounded-full border px-4 py-2 text-[14px] ${
                drinkProductId === drink.id
                  ? 'border-home-green bg-home-green text-white'
                  : 'border-home-border text-home-ink'
              }`}
            >
              {drink.name} · {formatEuro(drink.price, drink.currency)}
            </button>
          ))}
        </div>

        <h2 className="mt-8 text-[20px] font-medium text-home-ink">Postre (opcional)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDessertProductId(null)}
            className={`rounded-full border px-4 py-2 text-[14px] ${
              dessertProductId === null
                ? 'border-home-green bg-home-green text-white'
                : 'border-home-border text-home-ink'
            }`}
          >
            Sin postre
          </button>
          {desserts.map((dessert) => (
            <button
              key={dessert.id}
              type="button"
              onClick={() => setDessertProductId(dessert.id)}
              className={`rounded-full border px-4 py-2 text-[14px] ${
                dessertProductId === dessert.id
                  ? 'border-home-green bg-home-green text-white'
                  : 'border-home-border text-home-ink'
              }`}
            >
              {dessert.name} · {formatEuro(dessert.price, dessert.currency)}
            </button>
          ))}
        </div>

        <h2 className="mt-8 text-[20px] font-medium text-home-ink">Raciones</h2>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-home-border text-xl"
            onClick={() => setServings((n) => Math.max(1, n - 1))}
            aria-label="Menos raciones"
          >
            −
          </button>
          <span className="min-w-8 text-center text-[18px] font-medium">{servings}</span>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-home-border text-xl"
            onClick={() => setServings((n) => Math.min(99, n + 1))}
            aria-label="Más raciones"
          >
            +
          </button>
        </div>
      </section>

      <aside className="h-fit rounded-[16px] border border-home-border bg-home-panel p-6 lg:sticky lg:top-6">
        <h2 className="text-[18px] font-medium text-home-ink">Resumen</h2>
        {quoteQuery.isFetching ? (
          <p className="mt-3 text-[14px] text-home-muted">Calculando precio…</p>
        ) : null}
        {quoteQuery.isError ? (
          <p className="mt-3 text-[14px] text-red-700">
            No se pudo calcular el precio con esta configuración.
          </p>
        ) : null}
        {quoteQuery.data ? (
          <dl className="mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between gap-4">
              <dt className="text-home-muted">Base</dt>
              <dd>{formatEuro(quoteQuery.data.basePrice)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-home-muted">Extras ingredientes</dt>
              <dd>{formatEuro(quoteQuery.data.ingredientExtras)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-home-muted">Bebida</dt>
              <dd>{formatEuro(quoteQuery.data.drinkPrice)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-home-muted">Postre</dt>
              <dd>{formatEuro(quoteQuery.data.dessertPrice)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-home-border pt-2">
              <dt className="text-home-muted">Por ración</dt>
              <dd>{formatEuro(quoteQuery.data.unitPrice)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-[18px] font-medium text-home-ink">
              <dt>Total ({quoteQuery.data.quantity})</dt>
              <dd className="text-home-green">{formatEuro(quoteQuery.data.total)}</dd>
            </div>
          </dl>
        ) : null}

        {addError ? <p className="mt-4 text-[14px] text-red-700">{addError}</p> : null}

        <button
          type="button"
          disabled={addMutation.isPending || quoteQuery.isError}
          onClick={() => {
            setAddError(null);
            addMutation.mutate();
          }}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-home-green px-5 text-[16px] font-medium text-white disabled:opacity-50"
        >
          {addMutation.isPending ? 'Añadiendo…' : 'Añadir al carrito'}
        </button>
      </aside>
    </div>
  );
}

export function DishDetailPage() {
  const params = useParams<{ id: string }>();
  const dishId = Number(params.id);

  const dishQuery = useQuery({
    queryKey: queryKeys.dish(dishId),
    queryFn: () => getDish(dishId),
    enabled: Number.isFinite(dishId) && dishId > 0,
  });

  const drinksQuery = useQuery({
    queryKey: queryKeys.drinks,
    queryFn: () => listProductsByRole('DRINK'),
  });

  const dessertsQuery = useQuery({
    queryKey: queryKeys.desserts,
    queryFn: () => listProductsByRole('DESSERT'),
  });

  if (!Number.isFinite(dishId) || dishId <= 0) {
    return (
      <div className="min-h-screen bg-white">
        <MercadonaHeader />
        <main className="home-shell py-16">
          <p className="text-home-muted">Plato no válido.</p>
          <Link href="/platos" className="mt-4 inline-block text-home-green">
            Volver a platos
          </Link>
        </main>
      </div>
    );
  }

  if (dishQuery.isLoading) {
    return (
      <PageLoader
        eyebrow="TE LO DAMOS HECHO"
        title="Cargando el plato"
        hint="Un momento, estamos montando el detalle."
        variant="customize"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MercadonaHeader />
      <main className="home-shell py-8 pb-16">
        <Link href="/platos" className="text-[14px] font-medium text-home-green">
          ← Volver a platos
        </Link>

        {dishQuery.isError ? (
          <div className="mt-8 rounded-[12px] border border-red-200 bg-red-50 p-4 text-red-800">
            No se pudo cargar este plato.
          </div>
        ) : null}

        {dishQuery.data ? (
          <DishConfigurator
            key={dishQuery.data.id}
            dish={dishQuery.data}
            drinks={drinksQuery.data ?? []}
            desserts={dessertsQuery.data ?? []}
          />
        ) : null}
      </main>
    </div>
  );
}
