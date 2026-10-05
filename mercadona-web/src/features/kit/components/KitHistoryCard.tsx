'use client';

import { useId, useState } from 'react';
import { ChevronDown, Package } from 'lucide-react';
import type { KitCartProductLine } from '@/lib/cart/kit-storage';

export type KitHistoryTurn = {
  userMessage: string;
  plato: string;
  inKitCount: number;
  products: KitCartProductLine[];
};

type KitHistoryCardProps = {
  turn: KitHistoryTurn;
};

export function KitHistoryCard({ turn }: KitHistoryCardProps) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <article className="overflow-hidden rounded-[14px] border border-home-border/70 bg-white/80">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-home-panel/40"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium tracking-[0.12em] text-home-muted uppercase">
            Kit anterior
          </p>
          <p className="mt-0.5 truncate text-[13px] text-home-ink">“{turn.userMessage}”</p>
          <p className="mt-1 text-[12px] text-home-muted">
            {turn.plato} · {turn.inKitCount} ingredientes
          </p>
        </div>
        <ChevronDown
          className={`mt-1 size-4 shrink-0 text-home-green transition ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {open ? (
        <ul id={detailsId} className="space-y-2 border-t border-home-border/60 px-3 py-3">
          {turn.products.map((line) => (
            <li
              key={`${line.ingredient}-${line.productId}`}
              className="flex items-center gap-3 rounded-[12px] bg-home-panel/60 px-2.5 py-2"
            >
              <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                {line.mainImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.mainImageUrl} alt="" className="size-full object-contain p-0.5" />
                ) : (
                  <Package className="size-4 text-home-green/40" strokeWidth={1.5} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium capitalize text-home-muted">{line.ingredient}</p>
                <p className="truncate text-[13px] font-medium text-home-ink">{line.name}</p>
                {line.subtitle ? (
                  <p className="truncate text-[11px] text-home-muted">{line.subtitle}</p>
                ) : null}
              </div>
              <p className="shrink-0 text-[12px] font-medium text-home-green">{line.price}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
