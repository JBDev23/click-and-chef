import { Sparkles } from 'lucide-react';

const QUICK_IDEAS = [
  'Cena rápida',
  'Algo saludable',
  'Pasta para 4',
  'Macarrones con carne y tomate',
] as const;

type QuickIdeasProps = {
  selectedIdea: string;
  onSelect: (idea: string) => void;
};

export function QuickIdeas({ selectedIdea, onSelect }: QuickIdeasProps) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-6">
      <p className="w-full text-[12px] font-medium tracking-[0.16em] text-home-green sm:w-auto">
        IDEAS RÁPIDAS
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_IDEAS.map((idea) => {
          const selected = selectedIdea === idea;
          return (
            <button
              key={idea}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(idea)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-normal ${
                selected
                  ? 'border-home-accent bg-[#e5f5ed] text-home-ink'
                  : 'border-home-border bg-[#f7fcfa] text-home-ink hover:border-home-accent'
              }`}
            >
              <Sparkles
                aria-hidden="true"
                className="size-3.5 text-home-accent"
                strokeWidth={1.75}
              />
              {idea}
            </button>
          );
        })}
      </div>
    </div>
  );
}
