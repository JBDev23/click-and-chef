import { Send, Sparkles } from 'lucide-react';
import { useId } from 'react';

type MealIdeaFormProps = {
  value: string;
  error: string | null;
  showConfirmation: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function MealIdeaForm({
  value,
  error,
  showConfirmation,
  onChange,
  onSubmit,
}: MealIdeaFormProps) {
  const errorId = useId();

  return (
    <div>
      <div className="flex items-start gap-4 sm:items-center sm:gap-5">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-home-accent text-white">
          <Sparkles aria-hidden="true" className="size-7" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <h1
            id="meal-idea-heading"
            className="text-[26px] leading-tight font-medium text-home-ink sm:text-[32px] lg:text-[34px]"
          >
            ¿Qué tienes pensado comer hoy?
          </h1>
          <p className="mt-1 text-[15px] leading-snug text-home-muted sm:text-[17px]">
            Cuéntanos qué te apetece y te ayudamos a convertirlo en tu próximo plato.
          </p>
        </div>
      </div>

      <form
        className="mt-6 lg:mt-7"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label htmlFor="meal-idea" className="sr-only">
          Tu idea de comida
        </label>
        <div
          className={`flex h-[74px] items-center rounded-full border bg-white pr-2 pl-6 shadow-[0_8px_24px_rgba(33,78,82,0.07)] focus-within:ring-2 ${
            error
              ? 'border-[#d92d20] focus-within:ring-[#d92d20]/30'
              : 'border-home-border focus-within:ring-home-accent/30'
          }`}
        >
          <input
            id="meal-idea"
            name="idea"
            value={value}
            placeholder="Pasta para 4"
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onChange(event.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-[18px] text-home-ink outline-none placeholder:text-[#a3a3a3] focus-visible:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-[52px] shrink-0 items-center gap-2 rounded-full bg-home-accent px-5 text-[16px] font-medium text-white hover:bg-[#3f9668]"
          >
            <Send aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            Enviar
          </button>
        </div>
        <div className="mt-3 min-h-6">
          {error ? (
            <p id={errorId} role="alert" className="text-[14px] text-[#b42318]">
              {error}
            </p>
          ) : showConfirmation ? (
            <p className="text-[15px] text-home-muted sm:text-[16px]">
              Perfecto, vamos a buscar platos que encajen con tu idea.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
