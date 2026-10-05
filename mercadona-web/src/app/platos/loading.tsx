import { PageLoader } from '@/features/shared/components/PageLoader';

export default function PlatosLoading() {
  return (
    <PageLoader
      eyebrow="TE LO DAMOS HECHO"
      title="Buscando platos para ti"
      hint="Estamos eligiendo opciones que encajan con tu idea."
      variant="catalog"
    />
  );
}
