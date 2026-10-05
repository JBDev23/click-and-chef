'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { addDishToCart, createCart, deleteCartItem, fetchCart } from '@/features/cart/api/cart-api';
import type { Cart, CartIdentity } from '@/features/cart/types/cart';
import type { MealConfiguration } from '@/features/meal-customization/types/meal';
import { getErrorMessage, getProblemDetail } from '@/lib/api-client';

const STORAGE_KEY = 'mercadona.cart.v1';

type CartContextValue = {
  cart: Cart | null;
  identity: CartIdentity | null;
  isHydrated: boolean;
  isLoading: boolean;
  isPanelOpen: boolean;
  error: string | null;
  needsRecovery: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  clearError: () => void;
  refreshCart: () => Promise<void>;
  recoverCart: () => Promise<void>;
  addConfiguredDish: (dishId: number, configuration: MealConfiguration) => Promise<Cart>;
  removeItem: (itemId: number) => Promise<void>;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function readIdentity(): CartIdentity | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<CartIdentity>;
    if (!parsed.cartId || !parsed.cartToken) {
      return null;
    }
    return { cartId: parsed.cartId, cartToken: parsed.cartToken };
  } catch {
    return null;
  }
}

function writeIdentity(identity: CartIdentity | null) {
  if (typeof window === 'undefined') {
    return;
  }
  if (!identity) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<CartIdentity | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRecovery, setNeedsRecovery] = useState(false);
  const createPromiseRef = useRef<Promise<CartIdentity> | null>(null);

  const applyIdentity = useCallback((next: CartIdentity | null) => {
    setIdentity(next);
    writeIdentity(next);
  }, []);

  const loadCart = useCallback(async (current: CartIdentity) => {
    setIsLoading(true);
    setError(null);
    try {
      const nextCart = await fetchCart(current.cartId, current.cartToken);
      setCart(nextCart);
      setNeedsRecovery(false);
    } catch (err) {
      const problem = getProblemDetail(err);
      const status = problem?.status;
      if (status === 403 || status === 404) {
        setNeedsRecovery(true);
        setCart(null);
        setError(
          problem?.detail ??
            'No hemos podido recuperar tu carrito. Puedes crear uno nuevo para continuar.',
        );
      } else {
        setError(getErrorMessage(err, 'No hemos podido cargar el carrito.'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const stored = readIdentity();
    const timer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }
      setIdentity(stored);
      setIsHydrated(true);
      if (stored) {
        void loadCart(stored);
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [loadCart]);

  const ensureIdentity = useCallback(async (): Promise<CartIdentity> => {
    if (identity) {
      return identity;
    }
    if (createPromiseRef.current) {
      return createPromiseRef.current;
    }

    createPromiseRef.current = (async () => {
      const created = await createCart();
      const next = { cartId: created.cartId, cartToken: created.cartToken };
      applyIdentity(next);
      setNeedsRecovery(false);
      setCart({
        cartId: created.cartId,
        currency: created.currency,
        items: [],
        total: '0.00',
        createdAt: created.createdAt,
      });
      return next;
    })();

    try {
      return await createPromiseRef.current;
    } finally {
      createPromiseRef.current = null;
    }
  }, [applyIdentity, identity]);

  const addConfiguredDish = useCallback(
    async (dishId: number, configuration: MealConfiguration) => {
      const current = await ensureIdentity();
      const nextCart = await addDishToCart(
        current.cartId,
        current.cartToken,
        dishId,
        configuration,
      );
      setCart(nextCart);
      setNeedsRecovery(false);
      setError(null);
      setIsPanelOpen(true);
      return nextCart;
    },
    [ensureIdentity],
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      if (!identity) {
        return;
      }
      const nextCart = await deleteCartItem(identity.cartId, identity.cartToken, itemId);
      setCart(nextCart);
      setError(null);
    },
    [identity],
  );

  const recoverCart = useCallback(async () => {
    applyIdentity(null);
    setCart(null);
    setNeedsRecovery(false);
    setError(null);
    const created = await createCart();
    const next = { cartId: created.cartId, cartToken: created.cartToken };
    applyIdentity(next);
    setCart({
      cartId: created.cartId,
      currency: created.currency,
      items: [],
      total: '0.00',
      createdAt: created.createdAt,
    });
  }, [applyIdentity]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      identity,
      isHydrated,
      isLoading,
      isPanelOpen,
      error,
      needsRecovery,
      openPanel: () => setIsPanelOpen(true),
      closePanel: () => setIsPanelOpen(false),
      togglePanel: () => setIsPanelOpen((open) => !open),
      clearError: () => setError(null),
      refreshCart: async () => {
        if (identity) {
          await loadCart(identity);
        }
      },
      recoverCart,
      addConfiguredDish,
      removeItem,
      itemCount: cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    }),
    [
      addConfiguredDish,
      cart,
      error,
      identity,
      isHydrated,
      isLoading,
      isPanelOpen,
      loadCart,
      needsRecovery,
      recoverCart,
      removeItem,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider.');
  }
  return context;
}
