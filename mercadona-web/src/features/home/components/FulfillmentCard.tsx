import type { ReactNode, Ref } from 'react';
import { ArrowRight } from 'lucide-react';

type FulfillmentCardProps = {
  variant: 'ready' | 'kit';
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  badge?: string;
  compact?: boolean;
  onAction?: () => void;
  actionRef?: Ref<HTMLButtonElement>;
};

const variants = {
  ready: {
    card: 'bg-home-green text-white',
    iconWrap: 'bg-[#62a47e] text-white',
    description: 'text-white/90',
    button: 'bg-white text-home-green hover:bg-[#f4fbf7]',
    arrow: 'bg-[#d7efe3] text-home-green',
  },
  kit: {
    card: 'relative overflow-hidden border border-home-border bg-[linear-gradient(165deg,#f4faf7_0%,#ffffff_42%,#eef7f2_100%)] text-home-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]',
    iconWrap: 'bg-home-green text-white shadow-[0_10px_20px_rgba(63,137,96,0.22)]',
    description: 'text-home-muted',
    button: 'bg-home-green text-white hover:bg-[#367854]',
    arrow: 'bg-[#6aad88] text-white',
  },
} as const;

export function FulfillmentCard({
  variant,
  icon,
  eyebrow,
  title,
  description,
  actionLabel,
  badge,
  compact = false,
  onAction,
  actionRef,
}: FulfillmentCardProps) {
  const style = variants[variant];

  return (
    <article
      className={`flex flex-col rounded-[20px] p-6 sm:p-7 ${
        compact ? 'min-h-[240px] lg:min-h-[260px] lg:p-7' : 'min-h-[280px] lg:h-[315px] lg:p-8'
      } ${style.card}`}
    >
      {variant === 'kit' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-[radial-gradient(circle,rgba(74,166,117,0.22)_0%,transparent_68%)]"
        />
      ) : null}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex size-14 items-center justify-center rounded-2xl ${style.iconWrap}`}>
            {icon}
          </div>
          {badge ? (
            <span className="rounded-full bg-home-green px-3 py-1 text-[13px] font-medium text-white">
              {badge}
            </span>
          ) : null}
        </div>

        <p className="mt-5 text-[12px] tracking-[0.14em] sm:text-[13px]">{eyebrow}</p>
        <h3
          className={`mt-2 leading-tight font-bold ${
            compact
              ? 'text-[24px] sm:text-[28px]'
              : 'text-[28px] sm:text-[32px] lg:text-[36px]'
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-3 max-w-[34rem] text-[16px] leading-snug lg:text-[18px] ${style.description}`}
        >
          {description}
        </p>

        <div className="mt-auto pt-6">
          <button
            ref={actionRef}
            type="button"
            onClick={onAction}
            className={`inline-flex h-12 items-center gap-3 rounded-full px-5 text-[16px] font-medium ${style.button}`}
          >
            {actionLabel}
            <span
              aria-hidden="true"
              className={`inline-flex size-7 items-center justify-center rounded-full ${style.arrow}`}
            >
              <ArrowRight className="size-4" strokeWidth={2} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
