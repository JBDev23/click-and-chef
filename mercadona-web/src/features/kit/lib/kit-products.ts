import type { MatchedProduct } from '@/lib/api/types';
import type { KitCartProductLine } from '@/lib/cart/kit-storage';

export function buildKitProductLines(
  entries: [string, MatchedProduct[]][],
): KitCartProductLine[] {
  return entries.flatMap(([ingredient, products]) => {
    const product = products[0];
    if (!product) {
      return [];
    }
    return [
      {
        ingredient,
        productId: product.id,
        name: product.name,
        price: product.price,
        subtitle: product.subtitle,
        mainImageUrl: product.mainImageUrl,
      },
    ];
  });
}
