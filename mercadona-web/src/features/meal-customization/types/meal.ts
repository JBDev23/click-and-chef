export type ProductRole = 'DRINK' | 'DESSERT';

export type Complement = {
  id: number;
  sourceId: number;
  name: string;
  role: ProductRole;
  servingFormat: string;
  price: string;
  currency: string;
  imageUrl: string | null;
};

export type IngredientSelection = {
  dishIngredientId: number;
  quantity: number;
};

export type MealConfiguration = {
  ingredients: IngredientSelection[];
  drinkProductId: number | null;
  dessertProductId: number | null;
  quantity: number;
};

export type IngredientPrice = {
  dishIngredientId: number;
  productId: number;
  name: string;
  defaultQuantity: number;
  selectedQuantity: number;
  unit: 'G' | 'ML' | 'UNIT';
  extraPrice: string;
};

export type AddonPrice = {
  productId: number;
  name: string;
  servingFormat: string;
  price: string;
};

export type MealPrice = {
  currency: string;
  basePrice: string;
  ingredientExtras: string;
  drinkPrice: string;
  dessertPrice: string;
  unitPrice: string;
  quantity: number;
  total: string;
  ingredients: IngredientPrice[];
  drink: AddonPrice | null;
  dessert: AddonPrice | null;
};
