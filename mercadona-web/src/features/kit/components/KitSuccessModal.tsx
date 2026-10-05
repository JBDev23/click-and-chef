'use client';

import { useId } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '@/features/home/components/Modal';

type KitSuccessModalProps = {
  open: boolean;
  plato: string;
  productCount: number;
  onContinueChat: () => void;
  onCloseOverlay: () => void;
};

export function KitSuccessModal({
  open,
  plato,
  productCount,
  onContinueChat,
  onCloseOverlay,
}: KitSuccessModalProps) {
  const titleId = useId();

  return (
    <Modal open={open} onClose={onContinueChat} titleId={titleId} stackLayer="top">
      <div className="p-6 text-center sm:p-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[linear-gradient(145deg,#3f8960,#62a47e)] text-white shadow-[0_12px_28px_rgba(63,137,96,0.35)]">
          <Check className="size-8" strokeWidth={2.25} />
        </div>
        <h2 id={titleId} className="mt-5 text-[24px] font-medium text-home-ink sm:text-[26px]">
          ¡Kit listo!
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-home-muted">
          Tu MercaKit de{' '}
          <span className="font-medium text-home-ink">{plato}</span>
          {productCount > 0 ? (
            <>
              {' '}
              con <span className="font-medium text-home-ink">{productCount}</span> productos se ha
              añadido al carrito.
            </>
          ) : (
            ' se ha guardado.'
          )}
        </p>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onContinueChat}
            className="inline-flex h-11 items-center justify-center rounded-full bg-home-green px-6 text-[15px] font-medium text-white hover:bg-[#367854]"
          >
            Seguir hablando
          </button>
          <button
            type="button"
            onClick={onCloseOverlay}
            className="inline-flex h-11 items-center justify-center rounded-full border border-home-border px-6 text-[15px] font-medium text-home-ink hover:border-home-green hover:text-home-green"
          >
            Cerrar MercaKit
          </button>
        </div>
      </div>
    </Modal>
  );
}
