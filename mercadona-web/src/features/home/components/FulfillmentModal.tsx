'use client';

import { useId } from 'react';
import { House, Sparkles, X } from 'lucide-react';
import { FulfillmentCard } from '@/features/home/components/FulfillmentCard';
import { Modal } from '@/features/home/components/Modal';

type FulfillmentModalProps = {
  idea: string;
  open: boolean;
  onClose: () => void;
  onChooseReady: () => void;
  onChooseKit: () => void;
};

export function FulfillmentModal({
  idea,
  open,
  onClose,
  onChooseReady,
  onChooseKit,
}: FulfillmentModalProps) {
  const titleId = useId();

  return (
    <Modal open={open} onClose={onClose} titleId={titleId}>
      <div className="relative p-5 sm:p-7 lg:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full text-home-ink transition hover:bg-home-panel"
          aria-label="Cerrar"
        >
          <X className="size-5" strokeWidth={1.75} />
        </button>

        <p className="text-[12px] font-medium tracking-[0.18em] text-home-green sm:text-[13px]">
          DOS FORMAS DE LLEVARLO A TU MESA
        </p>
        <h2
          id={titleId}
          className="mt-3 max-w-[34rem] pr-10 text-[26px] leading-tight font-medium text-home-ink sm:text-[32px]"
        >
          ¿Cómo quieres disfrutarlo?
        </h2>
        <p className="mt-2 text-[16px] break-words text-home-muted sm:text-[17px]">
          Elige una opción para “{idea}”.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-[18px]">
          <FulfillmentCard
            variant="ready"
            compact
            eyebrow="LISTO PARA RECOGER"
            title="Te lo damos hecho"
            description="Elige un plato, personaliza sus ingredientes y lo preparamos al momento."
            actionLabel="Ver platos"
            icon={<Sparkles aria-hidden="true" className="size-6" strokeWidth={1.75} />}
            onAction={onChooseReady}
          />
          <FulfillmentCard
            variant="kit"
            compact
            eyebrow="COCÍNALO EN CASA"
            title="Hazlo tú mismo"
            description="Recibe todos los ingredientes en las cantidades justas y sigue la receta paso a paso."
            actionLabel="Crear mi kit"
            badge="MercaKit"
            icon={<House aria-hidden="true" className="size-6" strokeWidth={1.75} />}
            onAction={onChooseKit}
          />
        </div>
      </div>
    </Modal>
  );
}
