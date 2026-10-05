import { Suspense } from 'react';
import { DishesPage } from '@/features/dishes/components/DishesPage';

export default function PlatosRoute() {
  return (
    <Suspense
      fallback={
        <div className="home-shell py-16 text-home-muted">Cargando platos…</div>
      }
    >
      <DishesPage />
    </Suspense>
  );
}
