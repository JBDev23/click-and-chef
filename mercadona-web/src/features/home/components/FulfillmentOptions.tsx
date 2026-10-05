'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { House, Sparkles } from 'lucide-react';
import { FulfillmentCard } from '@/features/home/components/FulfillmentCard';

type FulfillmentOptionsProps = {
  idea: string;
};

export function FulfillmentOptions({ idea }: FulfillmentOptionsProps) {
  const router = useRouter();

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
          onAction={() => {
            const params = new URLSearchParams({ idea });
            router.push(`/platos?${params.toString()}`);
          }}
        />
        <FulfillmentCard
          variant="kit"
          eyebrow="COCÍNALO EN CASA"
          title="Hazlo tú mismo"
          description="Recibe todos los ingredientes en las cantidades justas y sigue la receta paso a paso."
          actionLabel="Crear mi kit"
          badge="MercaKit"
          icon={<House aria-hidden="true" className="size-6" strokeWidth={1.75} />}
          onAction={() => {
            const params = new URLSearchParams({ idea });
            router.push(`/kit?${params.toString()}`);
          }}
        />
      </div>

      <p className="mt-4 text-[13px] text-home-muted">
        ¿Prefieres explorar el catálogo sin la idea?{' '}
        <Link href="/platos" className="font-medium text-home-green underline-offset-2 hover:underline">
          Ver todos los platos
        </Link>
      </p>
    </div>
  );
}
