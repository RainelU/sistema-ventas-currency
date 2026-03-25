import { Currency, PriceResult } from '@/types/index';

/**
 * Calcula precios de venta por cada moneda configurada.
 *
 * Lógica:
 *  1. costoBs = costUSD × purchaseRate  (lo que costó en Bs al momento de comprar)
 *  2. Por cada moneda:
 *     - costEquivUSD = costoBs / currency.rate  (cuántos USD equivale en esa moneda)
 *     - salePriceUSD = costEquivUSD × (1 + profit/100)
 *     - salePriceVES = salePriceUSD × currency.rate
 *  3. Para dólar físico (sin tasa Bs): salePriceUSD = costUSD × (1 + profit/100)
 */
export function calculatePrices(
  costUSD: number,
  profitPercent: number,
  purchaseRate: number,   // tasa de compra (Bs/$) al momento de comprar
  currencies: Currency[]
): PriceResult[] {
  if (currencies.length === 0) return [];

  const costVES = round2(costUSD * purchaseRate); // costo real en Bs
  const multiplier = 1 + profitPercent / 100;

  return currencies.map(currency => {
    // Cuántos USD equivale ese costo en Bs según esta moneda
    const costEquivUSD = round2(costVES / currency.rate);
    const salePriceUSD = round2(costEquivUSD * multiplier);
    const salePriceVES = round2(salePriceUSD * currency.rate);

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
