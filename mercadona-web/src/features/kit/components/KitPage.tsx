'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { KitExperience } from '@/features/kit/components/KitExperience';

export function KitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idea = searchParams.get('idea')?.trim() || 'Pasta para 4';

  return (
    <div className="min-h-screen">
      <KitExperience
        idea={idea}
        onClose={() => router.push('/')}
        onViewDishes={() => router.push(`/platos?idea=${encodeURIComponent(idea)}`)}
      />
    </div>
  );
}
