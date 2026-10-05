'use client';

import { ChefHat, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const LOADING_STEPS = [
  'Entendiendo tu idea',
  'Calculando cantidades',
  'Buscando productos en Mercadona',
  'Afinando tu kit',
] as const;

function LoadingStepLabel({ stepIndex }: { stepIndex: number }) {
  const step = LOADING_STEPS[stepIndex % LOADING_STEPS.length];
  return (
    <span key={step} className="kit-step-label">
      {step}
    </span>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="kit-loading-card overflow-hidden rounded-[18px] border border-home-border/70 bg-white"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="flex items-center gap-3 border-b border-home-border/50 px-4 py-3">
        <div className="kit-shimmer size-7 rounded-full" />
        <div className="kit-shimmer h-3.5 flex-1 max-w-[40%] rounded-full" />
      </div>
      <div className="flex gap-4 p-4">
        <div className="kit-shimmer size-[84px] shrink-0 rounded-[14px]" />
        <div className="flex flex-1 flex-col gap-2.5 pt-1">
          <div className="kit-shimmer h-3 w-24 rounded-full" />
          <div className="kit-shimmer h-4 w-[78%] rounded-full" />
          <div className="kit-shimmer h-3 w-[52%] rounded-full" />
          <div className="kit-shimmer mt-1 h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function KitLoadingAvatar() {
  return (
    <div className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center">
      <span aria-hidden="true" className="kit-pulse-ring absolute inset-0 rounded-full bg-home-accent/35" />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#3f8960,#62a47e)] opacity-90"
      />
      <Sparkles className="relative size-4 animate-pulse text-white" strokeWidth={1.75} />
    </div>
  );
}

export function KitLoadingPanel() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % LOADING_STEPS.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className="kit-loading-panel overflow-hidden rounded-[20px] border border-home-border/80 bg-white shadow-[0_10px_32px_rgba(33,78,82,0.06)]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="border-b border-home-border/60 bg-[linear-gradient(90deg,#e7f6ee_0%,#ffffff_70%)] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="relative flex size-11 items-center justify-center rounded-2xl bg-home-green text-white shadow-[0_8px_20px_rgba(63,137,96,0.28)]">
            <ChefHat className="size-5 kit-float-icon" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-home-green">Preparando tu MercaKit</p>
            <p className="mt-0.5 flex items-center gap-2 text-[14px] text-home-ink">
              <LoadingStepLabel stepIndex={stepIndex} />
              <span className="kit-typing-dots inline-flex gap-0.5" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </p>
          </div>
        </div>
        <div
          className="kit-progress-track relative mt-4 h-1.5 overflow-hidden rounded-full bg-home-panel"
          role="progressbar"
          aria-valuetext={LOADING_STEPS[stepIndex]}
        >
          <div className="kit-progress-indeterminate absolute inset-y-0 w-2/5 rounded-full bg-[linear-gradient(90deg,#3f8960,#7bc49a,#3f8960)]" />
        </div>
        <p className="mt-2 text-[11px] text-home-muted">
          Paso {((stepIndex % LOADING_STEPS.length) + 1).toString()} de {LOADING_STEPS.length}
        </p>
      </div>

      <div className="space-y-3 bg-[#f7faf8] p-3 sm:p-4">
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    </section>
  );
}
