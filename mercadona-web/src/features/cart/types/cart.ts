import type { MealPrice } from '@/features/meal-customization/types/meal';

export type CartCreated = {
  cartId: string;
  cartToken: string;
  currency: string;
  createdAt: string;
};

export type CartItem = {
  id: number;
  dishId: number;
  dishName: string;
  quantity: number;
  price: MealPrice;
};

export type Cart = {
  cartId: string;
  currency: string;
  items: CartItem[];
  total: string;
  createdAt: string;
};

export type CartIdentity = {
  cartId: string;
  cartToken: string;
};
