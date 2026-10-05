import { apiClient, createCartClient } from '@/lib/api-client';
import type { Cart, CartCreated } from '@/features/cart/types/cart';
import type { MealConfiguration } from '@/features/meal-customization/types/meal';

export async function createCart(): Promise<CartCreated> {
  const { data } = await apiClient.post<CartCreated>('/carts');
  return data;
}

export async function fetchCart(cartId: string, cartToken: string): Promise<Cart> {
  const client = createCartClient(cartToken);
  const { data } = await client.get<Cart>(`/carts/${cartId}`);
  return data;
}

export async function addDishToCart(
  cartId: string,
  cartToken: string,
  dishId: number,
  configuration: MealConfiguration,
): Promise<Cart> {
  const client = createCartClient(cartToken);
  const payload = {
    dishId,
    configuration: {
      ingredients: configuration.ingredients,
      quantity: configuration.quantity,
      ...(configuration.drinkProductId != null
        ? { drinkProductId: configuration.drinkProductId }
        : {}),
      ...(configuration.dessertProductId != null
        ? { dessertProductId: configuration.dessertProductId }
        : {}),
    },
  };
  const { data } = await client.post<Cart>(`/carts/${cartId}/items`, payload);
  return data;
}

export async function deleteCartItem(
  cartId: string,
  cartToken: string,
  itemId: number,
): Promise<Cart> {
  const client = createCartClient(cartToken);
  const { data } = await client.delete<Cart>(`/carts/${cartId}/items/${itemId}`);
  return data;
}
