'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Check, ChefHat, Package, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { ApiError } from '@/lib/api/client';
import { fetchLayaRecipe } from '@/lib/api/laya';
import type { MatchedProduct } from '@/lib/api/types';
import { useCart } from '@/features/cart/hooks/use-cart';
import { KitHistoryCard, type KitHistoryTurn } from '@/features/kit/components/KitHistoryCard';
import { KitLoadingAvatar, KitLoadingPanel } from '@/features/kit/components/KitLoadingPanel';
import { KitSuccessModal } from '@/features/kit/components/KitSuccessModal';
import { buildKitProductLines } from '@/features/kit/lib/kit-products';

type KitExperienceProps = {
  idea: string;
  onClose: () => void;
  onViewDishes?: () => void;
};

type KitMessageComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  hint?: string;
  disabled?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
};

function KitMessageComposer({
  value,
  onChange,
  onSubmit,
  submitLabel,
  hint,
  disabled = false,
  inputRef,
}: KitMessageComposerProps) {
  return (
    <div className="border-t border-home-border/70 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="mx-auto w-full max-w-[760px]">
        {hint ? <p className="mb-2 text-[13px] text-home-muted">{hint}</p> : null}
        <form
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="sr-only" htmlFor="kit-follow-up">
            Tu mensaje para MercaKit
          </label>
          <input
            ref={inputRef}
            id="kit-follow-up"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Ej: Cambia el arroz por pasta integral..."
            className="h-12 min-w-0 flex-1 rounded-full border border-home-border bg-white px-4 text-[15px] text-home-ink outline-none placeholder:text-home-muted/80 focus:border-home-green focus:ring-2 focus:ring-home-accent/25 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-home-green px-5 text-[14px] font-medium text-white hover:bg-[#367854] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="size-4" strokeWidth={1.75} />
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

function ProductThumb({
  product,
  size = 'md',
}: {
  product: MatchedProduct | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  const box =
    size === 'lg' ? 'size-[84px] rounded-[14px]' : size === 'sm' ? 'size-12 rounded-lg' : 'size-16 rounded-[12px]';

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-[linear-gradient(160deg,#eef7f2,#f7faf8)] ${box}`}
    >
      {product?.mainImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.mainImageUrl} alt="" className="size-full object-contain p-1" />
      ) : (
        <Package className="size-5 text-home-green/35" strokeWidth={1.5} />
      )}
    </div>
  );
}

function IngredientBlock({
  index,
  ingredient,
  products,
  removed = false,
  onRemove,
  onRestore,
}: {
  index: number;
  ingredient: string;
  products: MatchedProduct[];
  removed?: boolean;
  onRemove?: () => void;
  onRestore?: () => void;
}) {
  const [showAlts, setShowAlts] = useState(false);
  const recommended = products[0] ?? null;
  const alternatives = products.slice(1);
  const altsId = useId();

  return (
    <article
      className={`overflow-hidden rounded-[18px] border bg-white shadow-[0_8px_24px_rgba(33,78,82,0.04)] ${
        removed ? 'border-home-border/60 opacity-75' : 'border-home-border/80'
      }`}
    >
      <div
        className={`flex items-center gap-3 border-b border-home-border/60 px-4 py-3 ${
          removed ? 'bg-home-panel/30' : 'bg-home-panel/50'
        }`}
      >
        <span
          className={`inline-flex size-7 items-center justify-center rounded-full text-[12px] font-medium ${
            removed ? 'bg-home-muted/40 text-white' : 'bg-home-green text-white'
          }`}
        >
          {index}
        </span>
        <h3
          className={`min-w-0 flex-1 truncate text-[15px] font-medium capitalize ${
            removed ? 'text-home-muted line-through' : 'text-home-ink'
          }`}
        >
          {ingredient}
        </h3>
        {removed ? (
          onRestore ? (
            <button
              type="button"
              onClick={onRestore}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-home-green/40 bg-white px-3 text-[12px] font-medium text-home-green hover:bg-[#e7f6ee]"
            >
              <RotateCcw className="size-3.5" strokeWidth={2} />
              Añadir
            </button>
          ) : null
        ) : (
          <>
            {alternatives.length > 0 ? (
              <span className="hidden text-[12px] text-home-muted sm:inline">
                +{alternatives.length} {alternatives.length === 1 ? 'opción' : 'opciones'}
              </span>
            ) : null}
            {onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-home-border bg-white px-3 text-[12px] font-medium text-home-muted hover:border-[#d92d20]/40 hover:text-[#b42318]"
                aria-label={`Quitar ${ingredient}`}
              >
                <X className="size-3.5" strokeWidth={2} />
                Quitar
              </button>
            ) : null}
          </>
        )}
      </div>

      {recommended && !removed ? (
        <div className="flex gap-4 p-4">
          <ProductThumb product={recommended} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f6ee] px-2.5 py-0.5 text-[11px] font-medium text-home-green">
                <Check className="size-3" strokeWidth={2.5} />
                Recomendado
              </span>
              {recommended.category ? (
                <span className="truncate text-[12px] text-home-muted">{recommended.category}</span>
              ) : null}
            </div>
            <p className="mt-2 text-[16px] leading-snug font-medium text-home-ink">
              {recommended.name}
            </p>
            {recommended.subtitle ? (
              <p className="mt-0.5 text-[13px] text-home-muted">{recommended.subtitle}</p>
            ) : null}
            <p className="mt-2 text-[18px] font-medium text-home-green">{recommended.price}</p>
          </div>
        </div>
      ) : removed ? (
        <p className="px-4 py-3 text-[13px] text-home-muted">No se incluirá en tu kit.</p>
      ) : (
        <p className="px-4 py-5 text-[14px] text-home-muted">Sin producto encontrado para este ingrediente.</p>
      )}

      {!removed && alternatives.length > 0 ? (
        <div className="border-t border-home-border/60 px-4 py-3">
          <button
            type="button"
            aria-expanded={showAlts}
            aria-controls={altsId}
            onClick={() => setShowAlts((value) => !value)}
            className="text-[13px] font-medium text-home-green hover:underline"
          >
            {showAlts ? 'Ocultar otras opciones' : 'Ver otras opciones'}
          </button>
          {showAlts ? (
            <ul id={altsId} className="mt-3 space-y-2">
              {alternatives.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-3 rounded-[12px] bg-home-panel/70 px-3 py-2.5"
                >
                  <ProductThumb product={product} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-home-ink">{product.name}</p>
                    {product.subtitle ? (
                      <p className="truncate text-[12px] text-home-muted">{product.subtitle}</p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-[13px] font-medium text-home-green">{product.price}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `kit-session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function KitExperience({ idea, onClose, onViewDishes }: KitExperienceProps) {
  const { addKitLine } = useCart();
  const [sessionId] = useState(createSessionId);
  const [started, setStarted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeIdea, setActiveIdea] = useState(idea);
  const [composeDraft, setComposeDraft] = useState(idea);
  const [history, setHistory] = useState<KitHistoryTurn[]>([]);
  const [uiPhase, setUiPhase] = useState<'results' | 'compose'>('results');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [excludedIngredients, setExcludedIngredients] = useState<Set<string>>(() => new Set());
  const feedRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const composeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const kitQuery = useQuery({
    queryKey: ['laya', 'recipe', sessionId, activeIdea],
    queryFn: () => fetchLayaRecipe(activeIdea),
    enabled: Boolean(activeIdea.trim()),
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    setExcludedIngredients(new Set());
  }, [activeIdea, kitQuery.dataUpdatedAt]);

  const response = kitQuery.data;
  const hasError =
    kitQuery.isError || (response && 'error' in response && Boolean(response.error));

  const errorMessage = (() => {
    if (response && 'error' in response && response.error) {
      return response.error;
    }
    if (kitQuery.error instanceof ApiError) {
      if (kitQuery.error.status === 0) {
        return 'No se pudo contactar con el backend. Comprueba que esté en marcha en el puerto 8082.';
      }
      return kitQuery.error.message;
    }
    if (kitQuery.isError) {
      return 'No se pudo generar el kit. Si usas Laya, asegúrate de que n8n esté disponible.';
    }
    return null;
  })();

  const cartEntries: [string, MatchedProduct[]][] =
    response && 'carrito' in response && response.carrito
      ? Object.entries(response.carrito)
      : [];

  const isExcluded = (ingredient: string) => excludedIngredients.has(ingredient);

  const activeEntries = cartEntries.filter(([ingredient]) => !isExcluded(ingredient));
  const excludedEntries = cartEntries.filter(([ingredient]) => isExcluded(ingredient));

  const productCount = activeEntries.reduce((sum, [, products]) => sum + products.length, 0);
  const recommendedCount = activeEntries.filter(([, products]) => products.length > 0).length;
  const excludedCount = excludedEntries.length;

  const isLoading = kitQuery.isLoading || kitQuery.isFetching;
  const hasResult = Boolean(response && 'plato' in response && response.plato);
  const showResultsFooter = hasResult && cartEntries.length > 0 && uiPhase === 'results';
  const showComposeBar = uiPhase === 'compose' || (hasError && !isLoading);
  const bottomPadding = showResultsFooter || showComposeBar ? 'pb-28' : 'pb-8';
  const platoName = response && 'plato' in response ? response.plato : '';

  function archiveCurrentTurn() {
    if (!hasResult || !platoName) return;
    setHistory((prev) => [
      ...prev,
      {
        userMessage: activeIdea,
        plato: platoName,
        inKitCount: activeEntries.length,
        products: buildKitProductLines(activeEntries),
      },
    ]);
  }

  function submitFollowUp() {
    const next = composeDraft.trim();
    if (!next || isLoading) return;
    if (next !== activeIdea) {
      archiveCurrentTurn();
      setActiveIdea(next);
    } else {
      void kitQuery.refetch();
    }
    setUiPhase('results');
    setShowSuccessModal(false);
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleListo() {
    if (!hasResult || recommendedCount === 0 || !platoName || isAddingToCart) return;
    const products = buildKitProductLines(activeEntries);
    setIsAddingToCart(true);
    void addKitLine({
      plato: platoName,
      userMessage: activeIdea,
      products,
    })
      .then(() => setShowSuccessModal(true))
      .finally(() => setIsAddingToCart(false));
  }

  function handleContinueChat() {
    setShowSuccessModal(false);
    setUiPhase('compose');
    setComposeDraft(activeIdea);
    requestAnimationFrame(() => composeInputRef.current?.focus());
  }

  function excludeIngredient(ingredient: string) {
    setExcludedIngredients((prev) => new Set(prev).add(ingredient));
  }

  function restoreIngredient(ingredient: string) {
    setExcludedIngredients((prev) => {
      const next = new Set(prev);
      next.delete(ingredient);
      return next;
    });
  }

  function restoreAllIngredients() {
    setExcludedIngredients(new Set());
  }

  useEffect(() => {
    if (!hasResult || !resultsRef.current) return;
    resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hasResult]);

  useEffect(() => {
    if (hasResult || !feedRef.current) return;
    feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [isLoading, hasError, hasResult]);

  const dishesHref = `/platos?idea=${encodeURIComponent(activeIdea)}`;

  useEffect(() => {
    if (uiPhase !== 'compose') return;
    requestAnimationFrame(() => composeInputRef.current?.focus());
  }, [uiPhase]);

  useEffect(() => {
    if (hasError) {
      setComposeDraft(activeIdea);
    }
  }, [hasError, activeIdea]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,#e8f3ec_0%,#f5f8f6_32%,#f3f5f4_100%)]">
      <KitSuccessModal
        open={showSuccessModal}
        plato={platoName || 'tu receta'}
        productCount={recommendedCount}
        onContinueChat={handleContinueChat}
        onCloseOverlay={onClose}
      />
      <header className="sticky top-0 z-20 shrink-0 border-b border-home-border/70 bg-white/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[760px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-10 items-center justify-center rounded-full text-home-ink transition hover:bg-home-panel"
              aria-label="Cerrar MercaKit"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
            <span className="inline-flex h-8 items-center rounded-full bg-home-green px-3 text-[13px] font-medium text-white">
              MercaKit
            </span>
            <p className="hidden truncate text-[15px] text-home-ink sm:block">
              Tu asistente de cocina
            </p>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-home-muted">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-home-accent opacity-40" />
              <span className="relative inline-flex size-2.5 rounded-full bg-home-accent" />
            </span>
            En línea
          </div>
        </div>
      </header>

      <div
        ref={feedRef}
        className={`mx-auto flex w-full max-w-[760px] min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7 ${bottomPadding}`}
      >
        {history.length > 0 ? (
          <div className="space-y-2">
            {history.map((turn, index) => (
              <KitHistoryCard key={`${turn.userMessage}-${turn.plato}-${index}`} turn={turn} />
            ))}
          </div>
        ) : null}

        <div
          className={`transition duration-500 ${started ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        >
          <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-home-border/80 bg-white py-2 pr-4 pl-2 shadow-[0_6px_18px_rgba(33,78,82,0.05)]">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,#d7efe3,#f4faf7)]">
              <ChefHat className="size-4 text-home-green" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-medium tracking-[0.14em] text-home-muted">TU IDEA</p>
              <p className="truncate text-[14px] font-medium text-home-ink">“{activeIdea}”</p>
            </div>
          </div>
        </div>

        <div
          className={`flex gap-3 transition duration-500 delay-75 ${started ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        >
          {isLoading ? (
            <KitLoadingAvatar />
          ) : (
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-home-green text-white shadow-[0_8px_18px_rgba(63,137,96,0.25)]">
              <Sparkles className="size-4" strokeWidth={1.75} />
            </div>
          )}
          <article className="min-w-0 flex-1 rounded-[18px] rounded-tl-md border border-home-border/80 bg-white px-4 py-3.5 shadow-[0_8px_24px_rgba(33,78,82,0.04)] sm:px-5">
            <p className="text-[12px] font-medium text-home-green">MercaKit</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-home-ink">
              {isLoading
                ? 'Estoy armando tu kit con las cantidades justas y productos del catálogo.'
                : hasResult
                  ? uiPhase === 'compose'
                    ? '¿Quieres ajustar algo? Escribe abajo y generamos un kit nuevo a partir de tu mensaje.'
                    : excludedCount > 0
                      ? `Tu kit tiene ${activeEntries.length} ingredientes. Puedes quitar los que no necesites.`
                      : 'Listo. Aquí tienes los ingredientes y el producto recomendado para cada uno.'
                  : 'Voy a montar tu kit con las cantidades justas y los productos que mejor encajan.'}
            </p>
          </article>
        </div>

        {isLoading ? <KitLoadingPanel /> : null}

        {hasError && errorMessage ? (
          <article className="rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950 sm:px-5">
            <p className="font-medium">No se pudo crear el kit</p>
            <p className="mt-2 text-[14px]">{errorMessage}</p>
            <p className="mt-3 text-[13px] text-amber-900/85">
              Edita el mensaje abajo y vuelve a intentarlo.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {onViewDishes ? (
                <button
                  type="button"
                  onClick={onViewDishes}
                  className="inline-flex h-10 items-center rounded-full border border-home-green px-4 text-[14px] font-medium text-home-green"
                >
                  Ver platos listos
                </button>
              ) : (
                <Link
                  href={dishesHref}
                  className="inline-flex h-10 items-center rounded-full border border-home-green px-4 text-[14px] font-medium text-home-green"
                >
                  Ver platos listos
                </Link>
              )}
            </div>
          </article>
        ) : null}

        {hasResult && response && 'plato' in response ? (
          <section ref={resultsRef} className="space-y-4">
            <div className="overflow-hidden rounded-[22px] border border-home-border/80 bg-white shadow-[0_14px_40px_rgba(33,78,82,0.08)]">
              <div className="relative overflow-hidden bg-[linear-gradient(135deg,#3f8960_0%,#4aa675_55%,#62a47e_100%)] px-5 py-5 text-white sm:px-6 sm:py-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-10 -right-8 size-36 rounded-full bg-white/10"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-16 left-10 size-40 rounded-full bg-black/5"
                />
                <p className="relative text-[11px] font-medium tracking-[0.16em] text-white/80">
                  TU MERCAKIT
                </p>
                <h2 className="relative mt-2 text-[26px] leading-tight font-medium sm:text-[30px]">
                  {response.plato}
                </h2>
                <div className="relative mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] backdrop-blur-sm">
                    {activeEntries.length} en tu kit
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] backdrop-blur-sm">
                    {recommendedCount} recomendados
                  </span>
                  {excludedCount > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] backdrop-blur-sm">
                      {excludedCount} quitados
                    </span>
                  ) : null}
                  {productCount > recommendedCount ? (
                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] backdrop-blur-sm">
                      {productCount - recommendedCount} alternativas
                    </span>
                  ) : null}
                  {typeof response.pasada2 === 'boolean' ? (
                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] backdrop-blur-sm">
                      {response.pasada2 ? 'Selección Laya' : 'Match de catálogo'}
                    </span>
                  ) : null}
                </div>
              </div>

              {cartEntries.length === 0 ? (
                <p className="px-5 py-6 text-[14px] text-home-muted sm:px-6">
                  No se encontraron productos para esta receta. Prueba otra idea o mira platos listos.
                </p>
              ) : (
                <div className="space-y-3 bg-[#f7faf8] p-3 sm:p-4">
                  {activeEntries.length === 0 ? (
                    <div className="rounded-[18px] border border-dashed border-home-border bg-white px-4 py-6 text-center">
                      <p className="text-[14px] text-home-muted">
                        Has quitado todos los ingredientes del kit.
                      </p>
                      <button
                        type="button"
                        onClick={restoreAllIngredients}
                        className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-home-green px-4 text-[13px] font-medium text-white"
                      >
                        <RotateCcw className="size-4" strokeWidth={2} />
                        Restaurar todos
                      </button>
                    </div>
                  ) : (
                    activeEntries.map(([ingredient, products], index) => (
                      <div
                        key={ingredient}
                        className="kit-fade-in"
                        style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
                      >
                        <IngredientBlock
                          index={index + 1}
                          ingredient={ingredient}
                          products={products}
                          onRemove={() => excludeIngredient(ingredient)}
                        />
                      </div>
                    ))
                  )}

                  {excludedEntries.length > 0 ? (
                    <div className="pt-2">
                      <div className="mb-2 flex items-center justify-between gap-2 px-1">
                        <p className="text-[12px] font-medium tracking-[0.12em] text-home-muted uppercase">
                          Quitados del kit
                        </p>
                        <button
                          type="button"
                          onClick={restoreAllIngredients}
                          className="text-[12px] font-medium text-home-green hover:underline"
                        >
                          Restaurar todos
                        </button>
                      </div>
                      <div className="space-y-2">
                        {excludedEntries.map(([ingredient, products], index) => (
                          <IngredientBlock
                            key={ingredient}
                            index={activeEntries.length + index + 1}
                            ingredient={ingredient}
                            products={products}
                            removed
                            onRestore={() => restoreIngredient(ingredient)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        ) : null}
      </div>

      {showResultsFooter ? (
        <div className="sticky bottom-0 z-20 border-t border-home-border/70 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-home-muted">
              {recommendedCount > 0 ? (
                <>
                  <span className="font-medium text-home-ink">{recommendedCount}</span> productos
                  recomendados en tu kit
                  {excludedCount > 0 ? (
                    <span className="text-home-muted"> · {excludedCount} quitados</span>
                  ) : null}
                </>
              ) : (
                <>Ningún ingrediente en el kit. Restaura alguno para continuar.</>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setUiPhase('compose');
                  setComposeDraft(activeIdea);
                }}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-home-border bg-white px-5 text-[14px] font-medium text-home-ink hover:border-home-green hover:text-home-green sm:flex-none"
              >
                Ajustar idea
              </button>
              {onViewDishes ? (
                <button
                  type="button"
                  onClick={onViewDishes}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-home-border bg-white px-5 text-[14px] font-medium text-home-ink hover:border-home-green hover:text-home-green sm:flex-none"
                >
                  Ver platos listos
                </button>
              ) : (
                <Link
                  href={dishesHref}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-home-border bg-white px-5 text-[14px] font-medium text-home-ink hover:border-home-green hover:text-home-green sm:flex-none"
                >
                  Ver platos listos
                </Link>
              )}
              <button
                type="button"
                onClick={handleListo}
                disabled={recommendedCount === 0 || isAddingToCart}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-home-green px-5 text-[14px] font-medium text-white hover:bg-[#367854] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {isAddingToCart ? 'Añadiendo…' : 'Listo'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showComposeBar ? (
        <div className="sticky bottom-0 z-20">
          <KitMessageComposer
            inputRef={composeInputRef}
            value={composeDraft}
            onChange={setComposeDraft}
            onSubmit={submitFollowUp}
            submitLabel={hasError ? 'Reintentar' : 'Enviar'}
            hint={
              hasError
                ? 'Partimos del mensaje anterior; edítalo si quieres cambiar la petición.'
                : 'Usamos tu mensaje anterior como punto de partida. Puedes modificarlo.'
            }
            disabled={isLoading}
          />
        </div>
      ) : null}
    </div>
  );
}
