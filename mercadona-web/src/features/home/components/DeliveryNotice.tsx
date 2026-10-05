import { House } from 'lucide-react';

export function DeliveryNotice() {
  return (
    <div className="flex min-h-[54px] items-center gap-3 rounded-[6px] bg-[#f5f5f5] px-4 py-3 text-[15px] text-[#333333] lg:h-[54px] lg:py-0">
      <House aria-hidden="true" className="size-5 shrink-0 text-[#00824b]" strokeWidth={1.75} />
      <p className="leading-snug">
        Identifícate y añade tu dirección para conocer la próxima entrega disponible{' '}
        <a href="#identificate" className="font-bold underline underline-offset-2">
          Identifícate
        </a>
      </p>
    </div>
  );
}
