'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import { MercadonaHeader } from '@/features/home/components/MercadonaHeader';
import { fetchKitCartLines, removeKitCartLine } from '@/lib/cart/kit-session';
import { sumKitLineTotal } from '@/lib/cart/kit-storage';
import { fetchCurrentCart, removeCurrentCartItem } from '@/lib/cart/session';
import { formatEuro } from '@/lib/format';
import { queryKeys } from '@/lib/query-keys';

export function CartPage() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: queryKeys.cart,
    queryFn: fetchCurrentCart,
  });

  const kitCartQuery = useQuery({
    queryKey: queryKeys.kitCart,
    queryFn: fetchKitCartLines,
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: number) => removeCurrentCartItem(itemId),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart, cart);
    },
  });

  const removeKitMutation = useMutation({
    mutationFn: (lineId: string) => removeKitCartLine(lineId),
    onSuccess: (lines) => {
      queryClient.setQueryData(queryKeys.kitCart, lines);
    },
  });

  const cart = cartQuery.data;
  const items = cart?.items ?? [];
  const kitLines = kitCartQuery.data ?? [];

  const dishTotal = cart ? Number.parseFloat(cart.total) || 0 : 0;
  const kitTotal = kitLines.reduce((sum, line) => sum + sumKitLineTotal(line), 0);
  const grandTotal = dishTotal + kitTotal;
  const isEmpty = items.length === 0 && kitLines.length === 0;

  return (
    <div className="min-h-screen bg-white">
      <MercadonaHeader />
      <main className="home-shell py-8 pb-16">
        <h1 className="text-[32px] font-medium text-home-ink sm:text-[40px]">Tu carrito</h1>
        <p className="mt-2 text-[16px] text-home-muted">
          Revisa tus platos y MercaKits antes de continuar.
        </p>

        {cartQuery.isLoading || kitCartQuery.isLoading ? (
          <p className="mt-10 text-home-muted">Cargando carrito…</p>
        ) : null}

        {cartQuery.isError ? (
          <div className="mt-10 rounded-[12px] border border-red-200 bg-red-50 p-4 text-red-800">
            No se pudo cargar el carrito de platos.
          </div>
        ) : null}

        {!cartQuery.isLoading && !kitCartQuery.isLoading && isEmpty ? (
          <div className="mt-10 rounded-[12px] border border-home-border bg-home-panel p-6">
            <p className="text-home-ink">Tu carrito está vacío.</p>
            <Link
              href="/platos"
              className="mt-4 inline-flex h-11 items-center rounded-full bg-home-green px-5 text-[15px] font-medium text-white"
            >
              Ver platos
            </Link>
          </div>
        ) : null}

        {!isEmpty ? (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-8">
              {kitLines.length > 0 ? (
                <section>
                  <h2 className="text-[12px] font-medium tracking-[0.14em] text-home-green uppercase">
                    MercaKit
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {kitLines.map((line) => (
                      <li
                        key={line.id}
                        className="rounded-[12px] border border-home-border p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] font-medium tracking-[0.12em] text-home-muted uppercase">
                              Kit de cocina
                            </p>
                            <h3 className="mt-1 text-[20px] font-medium text-home-ink">{line.plato}</h3>
                            <p className="mt-1 text-[13px] text-home-muted">“{line.userMessage}”</p>
                            <p className="mt-1 text-[14px] text-home-muted">
                              {line.products.length}{' '}
                              {line.products.length === 1 ? 'producto' : 'productos'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[18px] font-medium text-home-green">
                              {formatEuro(String(sumKitLineTotal(line)))}
                            </p>
                            <button
                              type="button"
                              className="mt-2 block text-[13px] text-red-700"
                              disabled={removeKitMutation.isPending}
                              onClick={() => removeKitMutation.mutate(line.id)}
                            >
                              Eliminar kit
                            </button>
                          </div>
                        </div>
                        <ul className="mt-4 space-y-2 border-t border-home-border pt-4">
                          {line.products.map((product) => (
                            <li
                              key={`${line.id}-${product.productId}`}
                              className="flex items-center gap-3 rounded-[10px] bg-home-panel/60 px-3 py-2"
                            >
                              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                                {product.mainImageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={product.mainImageUrl}
                                    alt=""
                                    className="size-full object-contain p-0.5"
                                  />
                                ) : (
                                  <Package className="size-4 text-home-green/40" strokeWidth={1.5} />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] capitalize text-home-muted">{product.ingredient}</p>
                                <p className="truncate text-[13px] font-medium text-home-ink">
                                  {product.name}
                                </p>
                              </div>
                              <p className="shrink-0 text-[13px] font-medium text-home-green">
                                {product.price}
                              </p>
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
                  <h2 className="text-[12px] font-medium tracking-[0.14em] text-home-green uppercase">
                    Platos
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-[12px] border border-home-border p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-[20px] font-medium text-home-ink">{item.dishName}</h3>
                            <p className="mt-1 text-[14px] text-home-muted">
                              {item.quantity} {item.quantity === 1 ? 'ración' : 'raciones'}
                            </p>
                            {item.price.drink ? (
                              <p className="mt-1 text-[13px] text-home-muted">
                                Bebida: {item.price.drink.name}
                              </p>
                            ) : null}
                            {item.price.dessert ? (
                              <p className="mt-1 text-[13px] text-home-muted">
                                Postre: {item.price.dessert.name}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-right">
                            <p className="text-[18px] font-medium text-home-green">
                              {formatEuro(item.price.total)}
                            </p>
                            <Link
                              href={`/platos/${item.dishId}`}
                              className="mt-2 inline-block text-[13px] text-home-green"
                            >
                              Ver plato
                            </Link>
                            <button
                              type="button"
                              className="mt-2 block text-[13px] text-red-700"
                              disabled={removeMutation.isPending}
                              onClick={() => removeMutation.mutate(item.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <aside className="h-fit rounded-[16px] border border-home-border bg-home-panel p-6">
              <h2 className="text-[18px] font-medium text-home-ink">Total</h2>
              <p className="mt-3 text-[28px] font-medium text-home-green">
                {formatEuro(String(grandTotal))}
              </p>
              {kitTotal > 0 ? (
                <p className="mt-2 text-[13px] text-home-muted">
                  Incluye {formatEuro(String(kitTotal))} en MercaKit
                </p>
              ) : null}
              <p className="mt-2 text-[13px] text-home-muted">
                Checkout no disponible en la demo.
              </p>
              <Link
                href="/platos"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border border-home-green text-[15px] font-medium text-home-green"
              >
                Seguir eligiendo
              </Link>
            </aside>
          </div>
        ) : null}
      </main>
    </div>
  );
}
