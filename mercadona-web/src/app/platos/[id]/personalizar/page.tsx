import { Suspense } from 'react';
import { CustomizeMealRoute } from '@/features/meal-customization/components/CustomizeMealRoute';
import { PageLoader } from '@/features/shared/components/PageLoader';

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <PageLoader
          eyebrow="TE LO DAMOS HECHO"
          title="Preparando tu plato"
          hint="Ajustamos ingredientes, bebida y postre a tu gusto."
          variant="customize"
        />
      }
    >
      <CustomizeMealRoute />
    </Suspense>
  );
}
