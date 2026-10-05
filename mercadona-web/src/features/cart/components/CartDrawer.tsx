'use client';

import { Package, Trash2, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { useCart } from '@/features/cart/hooks/use-cart';
import { formatIngredientQuantity } from '@/features/dishes/utils/dish-presentation';
import { sumKitCartTotal, sumKitLineTotal } from '@/lib/cart/kit-storage';
import { formatMoney } from '@/lib/money';

export function CartDrawer() {
  const {
    cart,
    isPanelOpen,
    closePanel,
    removeItem,
    error,
    needsRecovery,
    recoverCart,
    refreshCart,
    clearError,
    isLoading,
    kitLines,
    removeKitLine,
  } = useCart();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isPanelOpen) {
      return;
    }
    previousFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow || '';
      document.documentElement.style.overflow = previousHtmlOverflow || '';
      document.removeEventListener('keydown', onKeyDown);
      previousFocus.current?.focus();
    };
  }, [closePanel, isPanelOpen]);

  if (!isPanelOpen) {
    return null;
  }

  const items = cart?.items ?? [];
  const dishTotal = cart ? Number.parseFloat(cart.total) || 0 : 0;
  const kitTotal = sumKitCartTotal(kitLines);
  const grandTotal = Math.round((dishTotal + kitTotal) * 100) / 100;
  const isEmpty = items.length === 0 && kitLines.length === 0;

  return (
    <div className="fixed inset-0 z-[60]" role="presentation">
      <button
        type="button"
        aria-label="Cerrar carrito"
        className="absolute inset-0 bg-black/40"
        onClick={closePanel}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#e8e8e8] px-5 py-4">
          <h2 id={titleId} className="text-[20px] font-medium text-home-ink">
            Tu carrito
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Cerrar"
            onClick={closePanel}
            className="inline-flex size-10 items-center justify-center rounded-full border border-[#e0e0e0]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {error ? (
            <div className="mb-4 rounded-xl border border-[#f5c2c0] bg-[#fff5f5] p-4 text-[14px] text-[#b42318]">
              <p>{error}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {needsRecovery ? (
                  <button
                    type="button"
                    onClick={() => void recoverCart()}
                    className="rounded-full bg-home-green px-4 py-2 text-white"
                  >
                    Crear carrito nuevo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void refreshCart()}
                    className="rounded-full bg-home-green px-4 py-2 text-white"
                  >
                    Reintentar
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearError}
                  className="rounded-full border border-[#d0d0d0] px-4 py-2"
                >
                  Cerrar aviso
                </button>
              </div>
            </div>
          ) : null}

          {isLoading && !cart ? (
            <p className="text-home-muted">Cargando carrito…</p>
          ) : isEmpty ? (
            <p className="text-home-muted">Tu carrito está vacío.</p>
          ) : (
            <div className="space-y-6">
              {kitLines.length > 0 ? (
                <section>
                  <p className="text-[11px] font-medium tracking-[0.12em] text-home-green uppercase">
                    MercaKit
                  </p>
                  <ul className="mt-3 space-y-4">
                    {kitLines.map((line) => (
                      <li key={line.id} className="rounded-2xl border border-home-border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium tracking-[0.1em] text-home-muted uppercase">
                              Kit
                            </p>
                            <h3 className="text-[17px] font-medium text-home-ink">{line.plato}</h3>
                            <p className="mt-1 truncate text-[13px] text-home-muted">
                              “{line.userMessage}”
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <p className="text-[15px] font-medium text-home-green">
                              {formatMoney(sumKitLineTotal(line))}
                            </p>
                            <button
                              type="button"
                              aria-label={`Eliminar kit ${line.plato}`}
                              onClick={() => void removeKitLine(line.id)}
                              className="rounded-full p-2 text-home-muted hover:bg-[#f5f5f5] hover:text-home-ink"
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <ul className="mt-3 space-y-2">
                          {line.products.map((product) => (
                            <li
                              key={`${line.id}-${product.productId}`}
                              className="flex items-center gap-2 text-[13px] text-home-muted"
                            >
                              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-home-panel">
                                {product.mainImageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={product.mainImageUrl}
                                    alt=""
                                    className="size-full object-contain p-0.5"
                                  />
                                ) : (
                                  <Package className="size-3.5 text-home-green/40" strokeWidth={1.5} />
                                )}
                              </span>
                              <span className="min-w-0 flex-1 truncate">
                                <span className="capitalize">{product.ingredient}</span>:{' '}
                                {product.name}
                              </span>
                              <span className="shrink-0 text-home-green">{product.price}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {items.length > 0 ? (
                <section>
                  <p className="text-[11px] font-medium tracking-[0.12em] text-home-green uppercase">
                    Platos
                  </p>
                  <ul className="mt-3 space-y-4">
                    {items.map((item) => (
                      <li key={item.id} className="rounded-2xl border border-home-border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[17px] font-medium text-home-ink">{item.dishName}</h3>
                            <p className="mt-1 text-[14px] text-home-muted">
                              {item.quantity} {item.quantity === 1 ? 'ración' : 'raciones'}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Eliminar ${item.dishName}`}
                            onClick={() => void removeItem(item.id)}
                            className="rounded-full p-2 text-home-muted hover:bg-[#f5f5f5] hover:text-home-ink"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>

                        <ul className="mt-3 space-y-1 text-[13px] text-home-muted">
                          {item.price.ingredients.map((ingredient) => (
                            <li key={ingredient.dishIngredientId}>
                              {ingredient.name}:{' '}
                              {formatIngredientQuantity(ingredient.selectedQuantity, ingredient.unit)}
                            </li>
                          ))}
                          <li>Bebida: {item.price.drink ? item.price.drink.name : 'Sin bebida'}</li>
                          <li>Postre: {item.price.dessert ? item.price.dessert.name : 'Sin postre'}</li>
                        </ul>

                        <div className="mt-3 flex items-end justify-between text-[14px]">
                          <span className="text-home-muted">
                            {formatMoney(item.price.unitPrice)} / ración
                          </span>
                          <span className="font-medium text-home-ink">
                            {formatMoney(item.price.total)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          )}
        </div>

        <div className="border-t border-[#e8e8e8] px-5 py-4">
          <div className="flex items-end justify-between">
            <span className="text-[14px] text-home-muted">Total</span>
            <span className="text-[28px] leading-none font-bold text-home-ink">
              {formatMoney(grandTotal)}
            </span>
          </div>
          {kitTotal > 0 ? (
            <p className="mt-2 text-[12px] text-home-muted">
              Incluye {formatMoney(kitTotal)} en MercaKit
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
