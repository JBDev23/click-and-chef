const moneyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

export function formatMoney(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return moneyFormatter.format(0);
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }
  return moneyFormatter.format(numeric);
}
