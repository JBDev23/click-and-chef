export type MeasurementUnit = 'G' | 'ML' | 'UNIT';

export type DishSummary = {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string | null;
  basePrice: string;
  currency: string;
};

export type Ingredient = {
  dishIngredientId: number;
  productId: number;
  sourceId: number;
  name: string;
  available: boolean;
  defaultQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  stepQuantity: number;
  unit: MeasurementUnit;
  extraStepPrice: string;
};

export type DishDetail = {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string | null;
  basePrice: string;
  currency: string;
  ingredients: Ingredient[];
};
