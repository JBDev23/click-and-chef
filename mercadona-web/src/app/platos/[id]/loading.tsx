import { PageLoader } from '@/features/shared/components/PageLoader';

export default function PlatoLoading() {
  return (
    <PageLoader
      eyebrow="TE LO DAMOS HECHO"
      title="Cargando el plato"
      hint="Un momento, estamos montando el detalle."
      variant="customize"
    />
  );
}
