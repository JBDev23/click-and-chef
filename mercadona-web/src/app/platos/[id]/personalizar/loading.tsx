import { PageLoader } from '@/features/shared/components/PageLoader';

export default function CustomizeLoading() {
  return (
    <PageLoader
      eyebrow="TE LO DAMOS HECHO"
      title="Preparando tu plato"
      hint="Ajustamos ingredientes, bebida y postre a tu gusto."
      variant="customize"
    />
  );
}
