'use client';

import { useState } from 'react';
import { DeliveryNotice } from '@/features/home/components/DeliveryNotice';
import { FulfillmentOptions } from '@/features/home/components/FulfillmentOptions';
import { MealIdeaForm } from '@/features/home/components/MealIdeaForm';
import { MercadonaHeader } from '@/features/home/components/MercadonaHeader';
import { QuickIdeas } from '@/features/home/components/QuickIdeas';
import { StorefrontHighlights } from '@/features/home/components/StorefrontHighlights';

const INITIAL_IDEA = 'Pasta para 4';

export default function Home() {
  const [draft, setDraft] = useState(INITIAL_IDEA);
  const [confirmedIdea, setConfirmedIdea] = useState(INITIAL_IDEA);
  const [error, setError] = useState<string | null>(null);

  function confirmIdea(value: string) {
    const next = value.trim();
    if (!next) {
      setError('Escribe una idea para continuar.');
      return;
    }

    setDraft(next);
    setConfirmedIdea(next);
    setError(null);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <MercadonaHeader />
      <main className="home-shell pt-4 pb-16">
        <DeliveryNotice />
        <section
          aria-labelledby="meal-idea-heading"
          className="mt-9 rounded-[12px] border border-home-border bg-[radial-gradient(1100px_520px_at_100%_0%,#e7f6ee_0%,#f4faf7_64%)] p-4 sm:p-6 lg:p-[38px]"
        >
          <MealIdeaForm
            value={draft}
            error={error}
            showConfirmation={error === null}
            onChange={(value) => {
              setDraft(value);
              if (value.trim()) {
                setError(null);
              }
            }}
            onSubmit={() => confirmIdea(draft)}
          />
          <QuickIdeas selectedIdea={confirmedIdea} onSelect={confirmIdea} />
          <FulfillmentOptions idea={confirmedIdea} />
        </section>
        <StorefrontHighlights />
      </main>
    </div>
  );
}
