import {
  readKitCartLines,
  writeKitCartLines,
  type KitCartLine,
  type KitCartProductLine,
} from '@/lib/cart/kit-storage';

export type AddKitToCartInput = {
  plato: string;
  userMessage: string;
  products: KitCartProductLine[];
};

export async function fetchKitCartLines(): Promise<KitCartLine[]> {
  return readKitCartLines();
}

function createKitLineId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `kit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function addKitToCurrentCart(input: AddKitToCartInput): Promise<KitCartLine[]> {
  const lines = readKitCartLines();
  const next: KitCartLine = {
    id: createKitLineId(),
    plato: input.plato,
    userMessage: input.userMessage,
    addedAt: new Date().toISOString(),
    products: input.products,
  };
  const updated = [...lines, next];
  writeKitCartLines(updated);
  return updated;
}

export async function removeKitCartLine(lineId: string): Promise<KitCartLine[]> {
  const updated = readKitCartLines().filter((line) => line.id !== lineId);
  writeKitCartLines(updated);
  return updated;
}

export function countKitCartProducts(lines: KitCartLine[]): number {
  return lines.reduce((sum, line) => sum + line.products.length, 0);
}
