const KIT_CART_KEY = 'mercadona.kitCart';

export type KitCartProductLine = {
  ingredient: string;
  productId: number;
  name: string;
  price: string;
  subtitle: string | null;
  mainImageUrl: string | null;
};

export type KitCartLine = {
  id: string;
  plato: string;
  userMessage: string;
  addedAt: string;
  products: KitCartProductLine[];
};

export function readKitCartLines(): KitCartLine[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const raw = window.localStorage.getItem(KIT_CART_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as KitCartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeKitCartLines(lines: KitCartLine[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(KIT_CART_KEY, JSON.stringify(lines));
}

export function parsePriceAmount(price: string): number {
  const normalized = price.replace(/[^\d,.-]/g, '').replace(',', '.');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}

export function sumKitLineTotal(line: KitCartLine): number {
  return line.products.reduce((sum, product) => sum + parsePriceAmount(product.price), 0);
}
