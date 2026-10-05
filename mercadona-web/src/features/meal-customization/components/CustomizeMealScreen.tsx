'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCart } from '@/features/cart/hooks/use-cart';
import { useDishDetailQuery } from '@/features/dishes/hooks/use-dishes';
import type { Ingredient } from '@/features/dishes/types/dish';
import { buildFlowQuery, resolveDishImage } from '@/features/dishes/utils/dish-presentation';
import { ComplementGroup } from '@/features/meal-customization/components/ComplementGroup';
import { DishSuccessModal } from '@/features/meal-customization/components/DishSuccessModal';
import { IngredientStepper } from '@/features/meal-customization/components/IngredientStepper';
import {
  useDessertsQuery,
  useDrinksQuery,
} from '@/features/meal-customization/hooks/use-complements';
import { useMealQuote } from '@/features/meal-customization/hooks/use-meal-quote';
import type { Complement } from '@/features/meal-customization/types/meal';
import { PageLoader } from '@/features/shared/components/PageLoader';
import { getErrorMessage } from '@/lib/api-client';
import { formatMoney } from '@/lib/money';

type CustomizeMealScreenProps = {
  dishId: number;
  idea: string;
  servings: number;
};

export function CustomizeMealScreen({ dishId, idea, servings }: CustomizeMealScreenProps) {
  const router = useRouter();
  const dishQuery = useDishDetailQuery(dishId);
  const drinksQuery = useDrinksQuery();
  const dessertsQuery = useDessertsQuery();
  const { addConfiguredDish } = useCart();
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const dish = dishQuery.data;
  const resolvedImage = useMemo(
    () => (dish ? resolveDishImage(dish.slug, dish.imageUrl) : '/dishes/fallback.svg'),
    [dish],
  );

  if (dishQuery.isLoading) {
    return (
      <PageLoader
        eyebrow="TE LO DAMOS HECHO"
        title="Preparando tu plato"
        hint="Ajustamos ingredientes, bebida y postre a tu gusto."
        variant="customize"
      />
    );
  }

  if (dishQuery.isError || !dish) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-4">
        <p className="text-[#b42318]">
          {getErrorMessage(dishQuery.error, 'No hemos podido cargar el plato.')}
        </p>
        <button
          type="button"
          onClick={() => void dishQuery.refetch()}
          className="self-start rounded-full bg-home-green px-4 py-2 text-white"
        >
          Reintentar
        </button>
        <Link
          href={`/platos${buildFlowQuery(idea, servings)}`}
          className="text-home-green underline"
        >
          Ver otros platos
        </Link>
      </div>
    );
  }

  const complementsLoading = drinksQuery.isLoading || dessertsQuery.isLoading;

  return (
    <CustomizeMealForm
      key={dish.id}
      dishId={dish.id}
      dishName={dish.name}
      ingredients={dish.ingredients}
      idea={idea}
      servings={servings}
      imageSrc={imageSrc ?? resolvedImage}
      onImageError={() => setImageSrc('/dishes/fallback.svg')}
      drinks={drinksQuery.data ?? []}
      desserts={dessertsQuery.data ?? []}
      complementsLoading={complementsLoading}
      drinksError={drinksQuery.isError ? getErrorMessage(drinksQuery.error) : null}
      dessertsError={dessertsQuery.isError ? getErrorMessage(dessertsQuery.error) : null}
      onRetryDrinks={() => void drinksQuery.refetch()}
      onRetryDesserts={() => void dessertsQuery.refetch()}
      addConfiguredDish={addConfiguredDish}
      addError={addError}
      setAddError={setAddError}
      isAdding={isAdding}
      setIsAdding={setIsAdding}
      showSuccessModal={showSuccessModal}
      setShowSuccessModal={setShowSuccessModal}
      onViewDishes={(nextServings) =>
        router.push(`/platos${buildFlowQuery(idea, nextServings)}`)
      }
      onGoHome={() => router.push('/')}
    />
  );
}

type CustomizeMealFormProps = {
  dishId: number;
  dishName: string;
  ingredients: Ingredient[];
  idea: string;
  servings: number;
  imageSrc: string;
  onImageError: () => void;
  drinks: Complement[];
  desserts: Complement[];
  complementsLoading: boolean;
  drinksError: string | null;
  dessertsError: string | null;
  onRetryDrinks: () => void;
  onRetryDesserts: () => void;
  addConfiguredDish: ReturnType<typeof useCart>['addConfiguredDish'];
  addError: string | null;
  setAddError: (value: string | null) => void;
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
  showSuccessModal: boolean;
  setShowSuccessModal: (value: boolean) => void;
  onViewDishes: (servings: number) => void;
  onGoHome: () => void;
};

function CustomizeMealForm({
  dishId,
  dishName,
  ingredients,
  idea,
  servings,
  imageSrc,
  onImageError,
  drinks,
  desserts,
  complementsLoading,
  drinksError,
  dessertsError,
  onRetryDrinks,
  onRetryDesserts,
  addConfiguredDish,
  addError,
  setAddError,
  isAdding,
  setIsAdding,
  showSuccessModal,
  setShowSuccessModal,
  onViewDishes,
  onGoHome,
}: CustomizeMealFormProps) {
  const meal = useMealQuote({
    dishId,
    ingredients,
    initialServings: servings,
  });

  const canAdd =
    meal.quoteMatchesCurrent &&
    !meal.isQuoting &&
    !meal.hasUnavailableIngredient &&
    !isAdding &&
    !showSuccessModal &&
    !complementsLoading &&
    !drinksError &&
    !dessertsError;

  async function handleAdd() {
    if (!canAdd || !meal.quoteMatchesCurrent) {
      return;
    }
    setIsAdding(true);
    setAddError(null);
    try {
      await addConfiguredDish(dishId, meal.configuration);
      setShowSuccessModal(true);
    } catch (error) {
      setAddError(getErrorMessage(error, 'No hemos podido añadir el plato al carrito.'));
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="min-h-screen bg-white lg:grid lg:h-screen lg:grid-cols-[46%_54%] lg:overflow-hidden">
      <DishSuccessModal
        open={showSuccessModal}
        dishName={dishName}
        servings={meal.servings}
        onViewDishes={() => onViewDishes(meal.servings)}
        onGoHome={onGoHome}
      />
      <div className="relative h-[240px] overflow-hidden bg-[#1d1d1d] sm:h-[320px] lg:h-full">
        <Image
          src={imageSrc}
          alt={dishName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 46vw"
          className="object-cover"
          onError={onImageError}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-6 lg:p-10">
          <p className="text-[12px] font-medium tracking-[0.16em] text-[#9fd6b4]">
            TE LO DAMOS HECHO
          </p>
          <h1 className="mt-2 text-[30px] leading-tight font-bold text-white sm:text-[40px]">
            {dishName}
          </h1>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-col bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-[#ececec] px-4 py-4 sm:px-6 lg:px-10">
          <Link
            href={`/platos${buildFlowQuery(idea, meal.servings)}`}
            className="inline-flex items-center gap-2 text-[15px] text-home-green"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Ver otros platos
          </Link>
          <Link
            href={`/${buildFlowQuery(idea)}`}
            aria-label="Salir del flujo"
            className="inline-flex size-10 items-center justify-center rounded-full border border-[#e0e0e0]"
          >
            <X className="size-5" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-36 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-[700px]">
            <h2 className="text-[30px] leading-tight font-bold text-home-ink sm:text-[36px]">
              Hazlo a tu manera
            </h2>
            <p className="mt-2 text-[16px] text-home-muted">
              Añade o quita ingredientes. Nosotros lo preparamos al momento.
            </p>

            <section className="mt-8 border-t border-[#ececec] pt-6">
              <h3 className="text-[18px] font-medium text-home-ink">Ingredientes de Mercadona</h3>
              <p className="mt-1 text-[13px] text-home-muted">
                Cantidades por ración. Reducir ingredientes mantiene el precio base.
              </p>
              <div className="mt-2 divide-y divide-[#ececec]">
                {ingredients.map((ingredient) => (
                  <IngredientStepper
                    key={ingredient.dishIngredientId}
                    ingredient={ingredient}
                    quantity={
                      meal.selections[ingredient.dishIngredientId] ?? ingredient.defaultQuantity
                    }
                    onChange={(quantity) =>
                      meal.updateIngredient(ingredient.dishIngredientId, quantity)
                    }
                  />
                ))}
              </div>
            </section>

            <section className="mt-8 border-t border-[#ececec] pt-6">
              <h3 className="text-[18px] font-medium text-home-ink">Raciones</h3>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Reducir raciones"
                  disabled={meal.servings <= 1}
                  onClick={() => meal.setServings(Math.max(1, meal.servings - 1))}
                  className="inline-flex size-10 items-center justify-center rounded-full bg-[#f0f0f0] disabled:opacity-40"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span className="min-w-[3rem] text-center text-[18px] font-medium">
                  {meal.servings}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar raciones"
                  disabled={meal.servings >= 99}
                  onClick={() => meal.setServings(Math.min(99, meal.servings + 1))}
                  className="inline-flex size-10 items-center justify-center rounded-full bg-[#f0f0f0] disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </section>

            <section className="mt-8 border-t border-[#ececec] pt-6 pb-4">
              <h3 className="text-[18px] font-medium text-home-ink">Completa tu menú</h3>
              {complementsLoading ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-home-border/70 bg-[#f7faf8] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="kit-typing-dots inline-flex items-center gap-1" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                    <p className="text-[14px] text-home-muted">Cargando bebida y postre…</p>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="kit-shimmer h-14 rounded-2xl" />
                    <div className="kit-shimmer h-14 rounded-2xl" />
                    <div className="kit-shimmer h-14 rounded-2xl" />
                  </div>
                </div>
              ) : null}
              {!complementsLoading && drinksError ? (
                <div className="mt-3 text-[14px] text-[#b42318]">
                  {drinksError}{' '}
                  <button type="button" className="underline" onClick={onRetryDrinks}>
                    Reintentar
                  </button>
                </div>
              ) : null}
              {!complementsLoading && !drinksError ? (
                <ComplementGroup
                  legend="Bebida"
                  noneLabel="Sin bebida"
                  options={drinks}
                  value={meal.drinkProductId}
                  onChange={meal.setDrinkProductId}
                  name="drink"
                />
              ) : null}
              {!complementsLoading && dessertsError ? (
                <div className="mt-3 text-[14px] text-[#b42318]">
                  {dessertsError}{' '}
                  <button type="button" className="underline" onClick={onRetryDesserts}>
                    Reintentar
                  </button>
                </div>
              ) : null}
              {!complementsLoading && !dessertsError ? (
                <ComplementGroup
                  legend="Postre"
                  noneLabel="Sin postre"
                  options={desserts}
                  value={meal.dessertProductId}
                  onChange={meal.setDessertProductId}
                  name="dessert"
                />
              ) : null}
            </section>

            {meal.hasUnavailableIngredient ? (
              <p className="mt-4 text-[14px] text-[#b42318]" role="alert">
                Hay ingredientes no disponibles. No puedes añadir este plato ahora.
              </p>
            ) : null}
            {meal.quoteError ? (
              <p className="mt-4 text-[14px] text-[#b42318]" role="alert">
                {meal.quoteError}
              </p>
            ) : null}
            {addError ? (
              <p className="mt-4 text-[14px] text-[#b42318]" role="alert">
                {addError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-[#ececec] bg-white px-4 py-4 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-[700px] items-end justify-between gap-4">
            <div>
              <p className="text-[13px] text-home-muted">Total</p>
              <p className="text-[30px] leading-none font-bold text-home-ink" aria-live="polite">
                {meal.isQuoting || !meal.quoteMatchesCurrent
                  ? 'Calculando…'
                  : formatMoney(meal.quote?.total)}
              </p>
              {meal.quoteMatchesCurrent && meal.quote ? (
                <details className="mt-2 text-[12px] text-home-muted">
                  <summary className="cursor-pointer">Ver desglose</summary>
                  <ul className="mt-2 space-y-1">
                    <li>Precio por ración: {formatMoney(meal.quote.unitPrice)}</li>
                    <li>Raciones: {meal.quote.quantity}</li>
                    <li>Base: {formatMoney(meal.quote.basePrice)}</li>
                    <li>Suplementos: {formatMoney(meal.quote.ingredientExtras)}</li>
                    <li>Bebida: {formatMoney(meal.quote.drinkPrice)}</li>
                    <li>Postre: {formatMoney(meal.quote.dessertPrice)}</li>
                  </ul>
                </details>
              ) : null}
            </div>
            <button
              type="button"
              disabled={!canAdd}
              onClick={() => void handleAdd()}
              className="inline-flex h-14 min-w-[180px] items-center justify-center rounded-2xl bg-home-green px-6 text-[16px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAdding ? 'Añadiendo…' : 'Añadir al carro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
