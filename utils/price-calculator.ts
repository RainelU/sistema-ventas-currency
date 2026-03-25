import { Currency, PriceResult } from '@/types/index';

/**
 * Calcula precios de venta.
 * profitPercent: siempre almacenado como MARGEN % (0–99.99)
 * Fórmula margen: precio = costo / (1 - margen)
 */
export function calculatePrices(
  costUSD: number,
  profitPercent: number,  // siempre margen % internamente
  purchaseRate: number,
  currencies: Currency[]
): PriceResult[] {
  if (currencies.length === 0) return [];

  const margin = profitPercent / 100;
  if (margin >= 1) return [];

  const costVES = round2(costUSD * purchaseRate);
  const salePriceVES = round2(costVES / (1 - margin));

  return currencies.map(currency => {
    const costEquivUSD = round2(costVES / currency.rate);
    const salePriceUSD = round2(salePriceVES / currency.rate);

    return {
      currency,
      isReference: currency.rate === purchaseRate,
      costEquivUSD,
      costVES,
      salePriceUSD,
      salePriceVES,
      adjustedCostUSD: costEquivUSD,
    };
  });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
