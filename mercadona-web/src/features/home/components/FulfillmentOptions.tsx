'use client';

import { House, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { FulfillmentCard } from '@/features/home/components/FulfillmentCard';

type FulfillmentOptionsProps = {
  idea: string;
};

export function FulfillmentOptions({ idea }: FulfillmentOptionsProps) {
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const kitButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const closeDialog = useCallback(() => {
    setKitDialogOpen(false);
    kitButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!kitDialogOpen) {
      return;
    }

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDialog();
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closeDialog, kitDialogOpen]);

  return (
    <div className="mt-8 border-t border-home-border pt-8">
      <p className="text-[12px] font-medium tracking-[0.18em] text-home-green sm:text-[13px]">
        DOS FORMAS DE LLEVARLO A TU MESA
      </p>
      <h2 className="mt-3 text-[28px] leading-tight font-medium text-home-ink sm:text-[32px]">
        ¿Cómo quieres disfrutarlo?
      </h2>
      <p className="mt-2 text-[16px] break-words text-home-muted sm:text-[18px]">
        Elige una opción para “{idea}”.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-[18px] lg:grid-cols-2">
        <FulfillmentCard
          variant="ready"
          eyebrow="LISTO PARA RECOGER"
          title="Te lo damos hecho"
          description="Elige un plato, personaliza sus ingredientes y lo preparamos al momento."
          actionLabel="Ver platos"
          icon={<Sparkles aria-hidden="true" className="size-6" strokeWidth={1.75} />}
          // La web todavía no tiene pantalla de catálogo. El listado vive en GET /api/v1/dishes.
        />
        <FulfillmentCard
          variant="kit"
          eyebrow="COCÍNALO EN CASA"
          title="Hazlo tú mismo"
          description="Recibe todos los ingredientes en las cantidades justas y sigue la receta paso a paso."
          actionLabel="Crear mi kit"
          badge="MercaKit"
          actionRef={kitButtonRef}
          onAction={() => setKitDialogOpen(true)}
          icon={<House aria-hidden="true" className="size-6" strokeWidth={1.75} />}
        />
      </div>

      {kitDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={closeDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id={titleId} className="text-[22px] font-medium text-home-ink">
              Próximamente
            </h2>
            <p id={descriptionId} className="mt-2 text-[15px] text-home-muted">
              MercaKit todavía no está disponible.
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeDialog}
              className="mt-5 inline-flex h-11 items-center rounded-full bg-home-green px-5 text-[15px] font-medium text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
