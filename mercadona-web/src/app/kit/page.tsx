import { Suspense } from 'react';
import { KitPage } from '@/features/kit/components/KitPage';

function KitFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#eef6f1_0%,#f7faf8_28%,#f3f5f4_100%)]">
      <div className="h-16 border-b border-home-border/70 bg-white/90" />
      <div className="mx-auto w-full max-w-[920px] px-4 py-8 text-[15px] text-home-muted sm:px-6">
        Preparando MercaKit…
      </div>
    </div>
  );
}

export default function KitRoute() {
  return (
    <Suspense fallback={<KitFallback />}>
      <KitPage />
    </Suspense>
  );
}
