import { ChefHat } from 'lucide-react';

type PageLoaderProps = {
  eyebrow?: string;
  title: string;
  hint?: string;
  variant?: 'centered' | 'catalog' | 'customize';
};

function TypingDots() {
  return (
    <span className="kit-typing-dots inline-flex items-center gap-1" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function LoaderHeader({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="kit-loading-panel mx-auto w-full max-w-xl overflow-hidden rounded-[24px] border border-home-border/80 bg-white/95 shadow-[0_16px_48px_rgba(33,78,82,0.08)] backdrop-blur-sm">
      <div className="bg-[linear-gradient(90deg,#e7f6ee_0%,#ffffff_72%)] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start gap-4">
          <div className="relative flex size-14 shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              className="kit-pulse-ring absolute inset-0 rounded-[18px] bg-home-accent/30"
            />
            <span className="relative flex size-12 items-center justify-center rounded-[16px] bg-[linear-gradient(145deg,#3f8960,#62a47e)] text-white shadow-[0_10px_24px_rgba(63,137,96,0.3)]">
              <ChefHat className="size-6 kit-float-icon" strokeWidth={1.75} />
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[11px] font-medium tracking-[0.18em] text-home-green">{eyebrow}</p>
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[20px] leading-tight font-bold text-home-ink sm:text-[22px]">
              <span>{title}</span>
              <TypingDots />
            </p>
            {hint ? <p className="mt-2 text-[14px] leading-snug text-home-muted">{hint}</p> : null}
          </div>
        </div>

        <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-[#e8f3ec]">
          <span
            aria-hidden="true"
            className="kit-progress-indeterminate absolute top-0 h-full w-[42%] rounded-full bg-[linear-gradient(90deg,#3f8960,#4aa675,#ffa100)]"
          />
        </div>
      </div>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="kit-loading-card overflow-hidden rounded-[20px] border border-home-border/70 bg-white shadow-[0_10px_30px_rgba(33,78,82,0.05)]"
          style={{ animationDelay: `${index * 110}ms` }}
        >
          <div className="kit-shimmer aspect-[4/3] w-full" />
          <div className="space-y-3 p-5">
            <div className="kit-shimmer h-5 w-[70%] rounded-full" />
            <div className="kit-shimmer h-3.5 w-full rounded-full" />
            <div className="kit-shimmer h-3.5 w-[55%] rounded-full" />
            <div className="mt-4 flex items-end justify-between gap-3 pt-2">
              <div className="kit-shimmer h-6 w-24 rounded-full" />
              <div className="kit-shimmer h-10 w-32 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CustomizeSkeleton() {
  return (
    <div className="kit-loading-card overflow-hidden rounded-[24px] border border-home-border/80 bg-white shadow-[0_12px_36px_rgba(33,78,82,0.06)] lg:grid lg:min-h-[560px] lg:grid-cols-[46%_54%]">
      <div className="relative min-h-[240px] bg-[#1d1d1d] sm:min-h-[300px] lg:min-h-full">
        <div className="kit-shimmer absolute inset-0 opacity-40" />
        <div className="absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-black/70 to-transparent p-6 lg:p-10">
          <div className="h-3 w-28 rounded-full bg-white/35" />
          <div className="h-8 w-[72%] rounded-full bg-white/50" />
          <div className="h-4 w-[48%] rounded-full bg-white/30" />
        </div>
      </div>
      <div className="flex flex-col p-6 sm:p-8 lg:p-10">
        <div className="kit-shimmer h-8 w-[58%] rounded-full" />
        <div className="kit-shimmer mt-3 h-4 w-[78%] rounded-full" />
        <div className="mt-8 space-y-4 border-t border-[#ececec] pt-6">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="kit-shimmer h-4 w-[55%] rounded-full" />
                <div className="kit-shimmer h-3 w-[35%] rounded-full" />
              </div>
              <div className="kit-shimmer h-10 w-28 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#ececec] pt-6">
          <div className="space-y-2">
            <div className="kit-shimmer h-3 w-14 rounded-full" />
            <div className="kit-shimmer h-8 w-28 rounded-full" />
          </div>
          <div className="kit-shimmer h-14 w-44 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function PageLoader({
  eyebrow = 'CLICK & CHEF',
  title,
  hint,
  variant = 'centered',
}: PageLoaderProps) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(900px_420px_at_100%_0%,#e8f6ef_0%,#f7faf8_55%,#fbfbfb_100%)]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-home-accent/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-20 size-80 rounded-full bg-[#ffa100]/10 blur-3xl"
      />

      <div
        className={`home-shell relative flex min-h-screen flex-col py-10 sm:py-14 ${
          variant === 'centered' ? 'justify-center' : 'justify-start pt-8 sm:pt-10'
        }`}
      >
        <LoaderHeader eyebrow={eyebrow} title={title} hint={hint} />

        {variant === 'catalog' ? (
          <div className="mx-auto mt-8 w-full max-w-5xl">
            <CatalogSkeleton />
          </div>
        ) : null}

        {variant === 'customize' ? (
          <div className="mx-auto mt-8 w-full max-w-6xl">
            <CustomizeSkeleton />
          </div>
        ) : null}

        {variant === 'centered' ? (
          <div className="mx-auto mt-6 grid w-full max-w-xl grid-cols-3 gap-3 px-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="kit-loading-card kit-shimmer h-16 rounded-2xl sm:h-20"
                style={{ animationDelay: `${index * 120}ms` }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
