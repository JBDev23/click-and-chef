'use client';

import { Minus, Plus } from 'lucide-react';
import type { Ingredient } from '@/features/dishes/types/dish';
import { formatIngredientQuantity } from '@/features/dishes/utils/dish-presentation';
import { formatMoney } from '@/lib/money';

type IngredientStepperProps = {
  ingredient: Ingredient;
  quantity: number;
  onChange: (quantity: number) => void;
};

export function IngredientStepper({ ingredient, quantity, onChange }: IngredientStepperProps) {
  const canDecrease = quantity - ingredient.stepQuantity >= ingredient.minQuantity;
  const canIncrease = quantity + ingredient.stepQuantity <= ingredient.maxQuantity;
  const isRemoved = quantity === 0;
  const aboveDefault = quantity > ingredient.defaultQuantity;

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-[16px] font-medium text-home-ink">{ingredient.name}</p>
        {!ingredient.available ? (
          <p className="mt-1 text-[13px] text-[#b42318]">No disponible ahora mismo</p>
        ) : isRemoved ? (
          <p className="mt-1 text-[13px] text-home-muted">Sin este ingrediente · precio base</p>
        ) : (
          <p className="mt-1 text-[13px] text-home-muted">
            {formatIngredientQuantity(quantity, ingredient.unit)} por ración
            {aboveDefault
              ? ` · +${formatMoney(ingredient.extraStepPrice)} por cada ${formatIngredientQuantity(ingredient.stepQuantity, ingredient.unit)} extra`
              : quantity < ingredient.defaultQuantity
                ? ' · reducir mantiene el precio base'
                : ' · incluido'}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label={`Reducir ${ingredient.name}`}
          disabled={!canDecrease || !ingredient.available}
          onClick={() => onChange(quantity - ingredient.stepQuantity)}
          className="inline-flex size-9 items-center justify-center rounded-full bg-[#f0f0f0] text-home-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="min-w-[4.5rem] text-center text-[15px] font-medium text-home-ink">
          {formatIngredientQuantity(quantity, ingredient.unit)}
        </span>
        <button
          type="button"
          aria-label={`Aumentar ${ingredient.name}`}
          disabled={!canIncrease || !ingredient.available}
          onClick={() => onChange(quantity + ingredient.stepQuantity)}
          className="inline-flex size-9 items-center justify-center rounded-full bg-[#f0f0f0] text-home-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
