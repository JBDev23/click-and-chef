export const queryKeys = {
  dishes: ['dishes'] as const,
  dish: (id: number) => ['dishes', id] as const,
  drinks: ['products', 'DRINK'] as const,
  desserts: ['products', 'DESSERT'] as const,
  quote: (id: number, configKey: string) => ['dishes', id, 'quote', configKey] as const,
  cart: ['cart'] as const,
  kitCart: ['kitCart'] as const,
};
