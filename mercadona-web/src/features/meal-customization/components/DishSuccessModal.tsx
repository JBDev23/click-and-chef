'use client';

import { useId } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '@/features/home/components/Modal';

type DishSuccessModalProps = {
  open: boolean;
  dishName: string;
  servings: number;
  onViewDishes: () => void;
  onGoHome: () => void;
};

export function DishSuccessModal({
  open,
  dishName,
  servings,
  onViewDishes,
  onGoHome,
}: DishSuccessModalProps) {
  const titleId = useId();

  return (
    <Modal open={open} onClose={onGoHome} titleId={titleId} stackLayer="top">
      <div className="p-6 text-center sm:p-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[linear-gradient(145deg,#3f8960,#62a47e)] text-white shadow-[0_12px_28px_rgba(63,137,96,0.35)]">
          <Check className="size-8" strokeWidth={2.25} />
        </div>
        <h2 id={titleId} className="mt-5 text-[24px] font-medium text-home-ink sm:text-[26px]">
          ¡Plato añadido!
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-home-muted">
          Tu{' '}
          <span className="font-medium text-home-ink">{dishName}</span>
          {servings > 0 ? (
            <>
              {' '}
              para <span className="font-medium text-home-ink">{servings}</span>{' '}
              {servings === 1 ? 'ración' : 'raciones'} se ha añadido al carrito.
            </>
          ) : (
            ' se ha añadido al carrito.'
          )}
        </p>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onViewDishes}
            className="inline-flex h-11 items-center justify-center rounded-full bg-home-green px-6 text-[15px] font-medium text-white hover:bg-[#367854]"
          >
            Ver otros platos
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex h-11 items-center justify-center rounded-full border border-home-border px-6 text-[15px] font-medium text-home-ink hover:border-home-green hover:text-home-green"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </Modal>
  );
}
