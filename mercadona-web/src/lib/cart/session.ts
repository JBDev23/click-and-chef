import { ApiError } from '@/lib/api/client';
import {
  addCartItem,
  createCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from '@/lib/api/carts';
import type { AddDishToCart, Cart, MealConfiguration } from '@/lib/api/types';
import {
  clearStoredCart,
  readStoredCart,
  writeStoredCart,
  type StoredCart,
} from '@/lib/cart/storage';

async function createAndStoreCart(): Promise<StoredCart> {
  const created = await createCart();
  const stored = { cartId: created.cartId, cartToken: created.cartToken };
  writeStoredCart(stored);
  return stored;
}

export async function ensureCart(): Promise<StoredCart> {
  const existing = readStoredCart();
  if (existing) {
    return existing;
  }
  return createAndStoreCart();
}

async function withValidCart<T>(
  action: (cart: StoredCart) => Promise<T>,
): Promise<T> {
  const cart = await ensureCart();
  try {
    return await action(cart);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 403 || error.code === 'INVALID_CART_TOKEN')) {
      clearStoredCart();
      const fresh = await createAndStoreCart();
      return action(fresh);
    }
    throw error;
  }
}

export async function fetchCurrentCart(): Promise<Cart | null> {
  const stored = readStoredCart();
  if (!stored) {
    return null;
  }
  try {
    return await getCart(stored.cartId, stored.cartToken);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 403 || error.code === 'INVALID_CART_TOKEN')) {
      clearStoredCart();
      return null;
    }
    throw error;
  }
}

export async function addDishToCurrentCart(body: AddDishToCart): Promise<Cart> {
  return withValidCart((cart) => addCartItem(cart.cartId, cart.cartToken, body));
}

export async function updateCurrentCartItem(
  itemId: number,
  configuration: MealConfiguration,
): Promise<Cart> {
  return withValidCart((cart) =>
    updateCartItem(cart.cartId, itemId, cart.cartToken, configuration),
  );
}

export async function removeCurrentCartItem(itemId: number): Promise<Cart> {
  return withValidCart((cart) => deleteCartItem(cart.cartId, itemId, cart.cartToken));
}
