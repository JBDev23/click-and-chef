'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useDishDetailQuery } from '@/features/dishes/hooks/use-dishes';
import type { DishSummary } from '@/features/dishes/types/dish';
import {
  buildFlowQuery,
  formatIngredientQuantity,
  resolveDishImage,
} from '@/features/dishes/utils/dish-presentation';
import { formatMoney } from '@/lib/money';

type DishCardProps = {
  dish: DishSummary;
  idea: string;
  servings: number;
};

export function DishCard({ dish, idea, servings }: DishCardProps) {
  const detailQuery = useDishDetailQuery(dish.id);
  const [imageSrc, setImageSrc] = useState(resolveDishImage(dish.slug, dish.imageUrl));
  const ingredientsSummary =
    detailQuery.data?.ingredients.map((ingredient) => ingredient.name).join(' · ') ??
    'Cargando ingredientes…';

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-home-border bg-white shadow-[0_10px_30px_rgba(33,78,82,0.06)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#edf6f1]">
        <Image
          src={imageSrc}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={() => setImageSrc('/dishes/fallback.svg')}
          unoptimized
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-[22px] leading-tight font-bold text-home-ink">{dish.name}</h2>
        <p className="mt-2 line-clamp-3 text-[15px] leading-snug text-home-muted">
          {dish.description}
        </p>

        <div className="mt-4 border-t border-[#e8eee9] pt-3">
          <p className="line-clamp-2 text-[13px] leading-snug text-[#6f6f6f]">
            {detailQuery.isError ? 'No se han podido cargar los ingredientes.' : ingredientsSummary}
          </p>
          {detailQuery.data ? (
            <p className="mt-2 text-[12px] text-home-muted">
              Incluye{' '}
              {detailQuery.data.ingredients
                .map((ingredient) =>
                  formatIngredientQuantity(ingredient.defaultQuantity, ingredient.unit),
                )
                .join(', ')}{' '}
              por ración.
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[18px] font-bold text-home-ink">
              Desde {formatMoney(dish.basePrice)}
            </p>
            <p className="text-[12px] text-home-muted">por ración</p>
          </div>
          <Link
            href={`/platos/${dish.id}/personalizar${buildFlowQuery(idea, servings)}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#e7f6ee] px-4 py-2.5 text-[15px] font-medium text-home-green hover:bg-[#d8f0e4]"
          >
            Personalizar
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
