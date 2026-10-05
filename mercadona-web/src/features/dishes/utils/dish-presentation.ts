import type { MeasurementUnit } from '@/features/dishes/types/dish';

const LOCAL_DISH_IMAGES: Record<string, string> = {
  'pasta-tomate-queso': '/dishes/pasta-tomate-queso.jpg',
  'pasta-pollo': '/dishes/pasta-pollo.jpg',
  'paella-marisco': '/dishes/paella-marisco.jpg',
  'ensalada-pasta-atun': '/dishes/ensalada-pasta-atun.jpg',
  'lasana-verduras': '/dishes/lasana-verduras.jpg',
  'pasta-carbonara': '/dishes/pasta-carbonara.jpg',
};

export function resolveDishImage(slug: string, imageUrl: string | null | undefined): string {
  if (imageUrl && /^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }
  return LOCAL_DISH_IMAGES[slug] ?? '/dishes/fallback.svg';
}

export function formatIngredientQuantity(quantity: number, unit: MeasurementUnit): string {
  if (unit === 'G') {
    return `${quantity} g`;
  }
  if (unit === 'ML') {
    return `${quantity} ml`;
  }
  return quantity === 1 ? '1 ud.' : `${quantity} ud.`;
}

export function parseServingsFromIdea(idea: string): number {
  const match = idea.match(/para\s+(\d{1,2})\b/i);
  if (!match) {
    return 1;
  }
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }
  return Math.min(99, value);
}

export function buildFlowQuery(idea: string, servings?: number): string {
  const params = new URLSearchParams();
  if (idea.trim()) {
    params.set('idea', idea.trim());
  }
  if (servings != null) {
    params.set('servings', String(servings));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function filterDishesByIdea<T extends { name: string; description: string }>(
  dishes: T[],
  idea: string,
): T[] {
  const tokens = idea
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !['para', 'con', 'una', 'unos', 'algo'].includes(token));

  if (tokens.length === 0) {
    return dishes;
  }

  const scored = dishes
    .map((dish) => {
      const haystack = `${dish.name} ${dish.description}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
      return { dish, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.dish);

  return scored.length > 0 ? scored : dishes;
}
