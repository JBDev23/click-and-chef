import { Suspense } from 'react';
import { DishCatalogRoute } from '@/features/dishes/components/DishCatalogRoute';
import { PageLoader } from '@/features/shared/components/PageLoader';

export default function PlatosPage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          eyebrow="TE LO DAMOS HECHO"
          title="Buscando platos para ti"
          hint="Estamos eligiendo opciones que encajan con tu idea."
          variant="catalog"
        />
      }
    >
      <DishCatalogRoute />
    </Suspense>
  );
}
