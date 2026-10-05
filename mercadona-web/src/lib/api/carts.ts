import { apiClient } from '@/lib/api/client';
import type { AddDishToCart, Cart, CartCreated, MealConfiguration } from '@/lib/api/types';

function cartHeaders(token: string) {
  return { 'X-Cart-Token': token };
}

export async function createCart(): Promise<CartCreated> {
  const { data } = await apiClient.post<CartCreated>('/api/v1/carts');
  return data;
}

export async function getCart(cartId: string, token: string): Promise<Cart> {
  const { data } = await apiClient.get<Cart>(`/api/v1/carts/${cartId}`, {
    headers: cartHeaders(token),
  });
  return data;
}

export async function addCartItem(
  cartId: string,
  token: string,
  body: AddDishToCart,
): Promise<Cart> {
  const { data } = await apiClient.post<Cart>(`/api/v1/carts/${cartId}/items`, body, {
    headers: cartHeaders(token),
  });
  return data;
}

export async function updateCartItem(
  cartId: string,
  itemId: number,
  token: string,
  configuration: MealConfiguration,
): Promise<Cart> {
  const { data } = await apiClient.put<Cart>(
    `/api/v1/carts/${cartId}/items/${itemId}`,
    configuration,
    { headers: cartHeaders(token) },
  );
  return data;
}

export async function deleteCartItem(
  cartId: string,
  itemId: number,
  token: string,
): Promise<Cart> {
  const { data } = await apiClient.delete<Cart>(
    `/api/v1/carts/${cartId}/items/${itemId}`,
    { headers: cartHeaders(token) },
  );
  return data;
}
