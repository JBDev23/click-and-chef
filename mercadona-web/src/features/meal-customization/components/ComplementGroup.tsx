'use client';

import type { Complement } from '@/features/meal-customization/types/meal';
import { formatMoney } from '@/lib/money';

type ComplementGroupProps = {
  legend: string;
  noneLabel: string;
  options: Complement[];
  value: number | null;
  onChange: (value: number | null) => void;
  name: string;
};

export function ComplementGroup({
  legend,
  noneLabel,
  options,
  value,
  onChange,
  name,
}: ComplementGroupProps) {
  return (
    <fieldset className="mt-5">
      <legend className="text-[14px] font-medium text-home-ink">{legend}</legend>
      <div
        role="radiogroup"
        aria-label={legend}
        className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
      >
        <button
          type="button"
          role="radio"
          aria-checked={value === null}
          name={name}
          onClick={() => onChange(null)}
          className={`rounded-2xl border px-4 py-3 text-left text-[14px] ${
            value === null
              ? 'border-home-accent bg-[#e9f7f0] text-home-ink'
              : 'border-[#e4e4e4] bg-white text-home-ink hover:border-home-border'
          }`}
        >
          <span className="font-medium">{noneLabel}</span>
        </button>
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              name={name}
              onClick={() => onChange(option.id)}
              className={`rounded-2xl border px-4 py-3 text-left text-[14px] ${
                selected
                  ? 'border-home-accent bg-[#e9f7f0] text-home-ink'
                  : 'border-[#e4e4e4] bg-white text-home-ink hover:border-home-border'
              }`}
            >
              <span className="block font-medium">{option.name}</span>
              <span className="mt-1 block text-[12px] text-home-muted">
                {option.servingFormat} · {formatMoney(option.price)} / ración
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
