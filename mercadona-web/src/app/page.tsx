'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DeliveryNotice } from '@/features/home/components/DeliveryNotice';
import { FulfillmentModal } from '@/features/home/components/FulfillmentModal';
import { MealIdeaForm } from '@/features/home/components/MealIdeaForm';
import { MercadonaHeader } from '@/features/home/components/MercadonaHeader';
import { QuickIdeas } from '@/features/home/components/QuickIdeas';
import { StorefrontHighlights } from '@/features/home/components/StorefrontHighlights';
import { KitModal } from '@/features/kit/components/KitModal';

type MealFlow =
  | { step: 'choose'; idea: string }
  | { step: 'kit'; idea: string }
  | null;

export default function Home() {
  const router = useRouter();
  const [draft, setDraft] = useState('');
  const [confirmedIdea, setConfirmedIdea] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flow, setFlow] = useState<MealFlow>(null);

  function confirmIdea(value: string) {
    const next = value.trim();
    if (!next) {
      setError('Escribe una idea para continuar.');
      setConfirmedIdea(null);
      setFlow(null);
      return;
    }

    setDraft(next);
    setConfirmedIdea(next);
    setError(null);
    setFlow({ step: 'choose', idea: next });
  }

  function closeFlow() {
    setFlow(null);
  }

  function goToDishes(idea: string) {
    closeFlow();
    router.push(`/platos?idea=${encodeURIComponent(idea)}`);
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
            showConfirmation={confirmedIdea !== null && error === null}
            onChange={(value) => {
              setDraft(value);
              if (value.trim()) {
                setError(null);
              }
              if (confirmedIdea !== null && value.trim() !== confirmedIdea) {
                setConfirmedIdea(null);
              }
            }}
            onSubmit={() => confirmIdea(draft)}
          />
          <QuickIdeas
            selectedIdea={confirmedIdea ?? draft}
            onSelect={(idea) => {
              setDraft(idea);
              confirmIdea(idea);
            }}
          />
        </section>
        <StorefrontHighlights />
      </main>

      <FulfillmentModal
        open={flow?.step === 'choose'}
        idea={flow?.step === 'choose' ? flow.idea : ''}
        onClose={closeFlow}
        onChooseReady={() => {
          if (flow?.step === 'choose') {
            goToDishes(flow.idea);
          }
        }}
        onChooseKit={() => {
          if (flow?.step === 'choose') {
            setFlow({ step: 'kit', idea: flow.idea });
          }
        }}
      />

      <KitModal
        open={flow?.step === 'kit'}
        idea={flow?.step === 'kit' ? flow.idea : ''}
        onClose={closeFlow}
        onViewDishes={() => {
          if (flow?.step === 'kit') {
            goToDishes(flow.idea);
          }
        }}
      />
    </div>
  );
}
