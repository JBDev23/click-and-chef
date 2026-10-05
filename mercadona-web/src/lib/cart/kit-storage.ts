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
  const cleaned = price.replace(/[^\d,.-]/g, '');
  if (!cleaned) {
    return 0;
  }

  // Spanish retail prices: "1,25 €" or "1.234,56 €". Dot-decimal "1.25" also works.
  let normalized = cleaned;
  if (cleaned.includes(',') && cleaned.includes('.')) {
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(',')) {
    normalized = cleaned.replace(',', '.');
  }

  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}

export function sumKitLineTotal(line: KitCartLine): number {
  const total = line.products.reduce((sum, product) => sum + parsePriceAmount(product.price), 0);
  return Math.round(total * 100) / 100;
}

export function sumKitCartTotal(lines: KitCartLine[]): number {
  const total = lines.reduce((sum, line) => sum + sumKitLineTotal(line), 0);
  return Math.round(total * 100) / 100;
}
