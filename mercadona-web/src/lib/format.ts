import type { MeasurementUnit } from '@/lib/api/types';

export function formatEuro(amount: string, currency = 'EUR'): string {
  const value = Number(amount);
  if (Number.isNaN(value)) {
    return `${amount} ${currency === 'EUR' ? '€' : currency}`;
  }
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatQuantity(quantity: number, unit: MeasurementUnit): string {
  switch (unit) {
    case 'G':
      return `${quantity} g`;
    case 'ML':
      return `${quantity} ml`;
    case 'UNIT':
      return quantity === 1 ? '1 ud' : `${quantity} uds`;
    default:
      return String(quantity);
  }
}
