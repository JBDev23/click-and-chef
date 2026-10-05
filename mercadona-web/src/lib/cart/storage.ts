const CART_ID_KEY = 'mercadona.cartId';
const CART_TOKEN_KEY = 'mercadona.cartToken';

export type StoredCart = {
  cartId: string;
  cartToken: string;
};

export function readStoredCart(): StoredCart | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const cartId = window.localStorage.getItem(CART_ID_KEY);
  const cartToken = window.localStorage.getItem(CART_TOKEN_KEY);
  if (!cartId || !cartToken) {
    return null;
  }
  return { cartId, cartToken };
}

export function writeStoredCart(cart: StoredCart): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(CART_ID_KEY, cart.cartId);
  window.localStorage.setItem(CART_TOKEN_KEY, cart.cartToken);
}

export function clearStoredCart(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(CART_ID_KEY);
  window.localStorage.removeItem(CART_TOKEN_KEY);
}
