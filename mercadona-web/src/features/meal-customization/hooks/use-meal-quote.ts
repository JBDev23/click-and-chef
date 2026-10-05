'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Ingredient } from '@/features/dishes/types/dish';
import { quoteMeal } from '@/features/meal-customization/api/meal-api';
import type { MealConfiguration, MealPrice } from '@/features/meal-customization/types/meal';
import { getErrorMessage } from '@/lib/api-client';

function serializeConfiguration(configuration: MealConfiguration): string {
  return JSON.stringify({
    ingredients: configuration.ingredients
      .map((item) => ({
        dishIngredientId: item.dishIngredientId,
        quantity: item.quantity,
      }))
      .sort((a, b) => a.dishIngredientId - b.dishIngredientId),
    drinkProductId: configuration.drinkProductId,
    dessertProductId: configuration.dessertProductId,
    quantity: configuration.quantity,
  });
}

function createInitialSelections(ingredients: Ingredient[]): Record<number, number> {
  return Object.fromEntries(
    ingredients.map((ingredient) => [ingredient.dishIngredientId, ingredient.defaultQuantity]),
  );
}

type UseMealQuoteArgs = {
  dishId: number;
  ingredients: Ingredient[];
  initialServings: number;
};

export function useMealQuote({ dishId, ingredients, initialServings }: UseMealQuoteArgs) {
  const [selections, setSelections] = useState<Record<number, number>>(() =>
    createInitialSelections(ingredients),
  );
  const [servings, setServings] = useState(initialServings);
  const [drinkProductId, setDrinkProductId] = useState<number | null>(null);
  const [dessertProductId, setDessertProductId] = useState<number | null>(null);
  const [quote, setQuote] = useState<MealPrice | null>(null);
  const [quotedKey, setQuotedKey] = useState<string | null>(null);
  const [isQuoting, setIsQuoting] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const configuration = useMemo<MealConfiguration>(
    () => ({
      ingredients: ingredients.map((ingredient) => ({
        dishIngredientId: ingredient.dishIngredientId,
        quantity: selections[ingredient.dishIngredientId] ?? ingredient.defaultQuantity,
      })),
      drinkProductId,
      dessertProductId,
      quantity: servings,
    }),
    [dessertProductId, drinkProductId, ingredients, selections, servings],
  );

  const configurationKey = useMemo(() => serializeConfiguration(configuration), [configuration]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      setIsQuoting(true);
      setQuoteError(null);

      void quoteMeal(dishId, configuration, controller.signal)
        .then((price) => {
          if (requestId !== requestIdRef.current) {
            return;
          }
          setQuote(price);
          setQuotedKey(configurationKey);
          setIsQuoting(false);
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted || requestId !== requestIdRef.current) {
            return;
          }
          setQuote(null);
          setQuotedKey(null);
          setIsQuoting(false);
          setQuoteError(getErrorMessage(error, 'No hemos podido calcular el precio.'));
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [configuration, configurationKey, dishId]);

  const updateIngredient = useCallback((dishIngredientId: number, quantity: number) => {
    setSelections((current) => ({ ...current, [dishIngredientId]: quantity }));
  }, []);

  const hasUnavailableIngredient = ingredients.some((ingredient) => !ingredient.available);
  const quoteMatchesCurrent = quotedKey === configurationKey && quote != null;

  return {
    configuration,
    configurationKey,
    selections,
    servings,
    setServings,
    drinkProductId,
    setDrinkProductId,
    dessertProductId,
    setDessertProductId,
    updateIngredient,
    quote,
    isQuoting,
    quoteError,
    quoteMatchesCurrent,
    hasUnavailableIngredient,
  };
}
