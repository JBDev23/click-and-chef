export type MeasurementUnit = 'G' | 'ML' | 'UNIT';

export type ProductRole = 'DRINK' | 'DESSERT' | 'INGREDIENT' | 'OTHER';

export type DishSummary = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
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

export type DishDetail = DishSummary & {
  ingredients: Ingredient[];
};

export type IngredientSelection = {
  dishIngredientId: number;
  quantity: number;
};

export type MealConfiguration = {
  ingredients?: IngredientSelection[];
  drinkProductId?: number | null;
  dessertProductId?: number | null;
  quantity: number;
};

export type IngredientPrice = {
  dishIngredientId: number;
  productId: number;
  name: string;
  defaultQuantity: number;
  selectedQuantity: number;
  unit: MeasurementUnit;
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

export type AddDishToCart = {
  dishId: number;
  configuration: MealConfiguration;
};

export type MatchedProduct = {
  id: number;
  sourceId: number;
  name: string;
  category: string | null;
  subtitle: string | null;
  price: string;
  mainImageUrl: string | null;
};

export type LayaRecipeSuccess = {
  plato: string;
  carrito: Record<string, MatchedProduct[]>;
  pasada2: boolean;
  error?: undefined;
};

export type LayaRecipeError = {
  error: string;
  plato?: undefined;
  carrito?: undefined;
  pasada2?: undefined;
};

export type LayaRecipeResponse = LayaRecipeSuccess | LayaRecipeError;

export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  code?: string;
  errors?: Record<string, string>;
};
