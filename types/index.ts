export interface Product {
  id: string;
  name: string;
  costUSD: number;
  profitPercent: number;
  purchaseRateId: string;  // id de la moneda con la que se compró
  purchaseRate: number;    // tasa de compra en el momento de la compra (Bs/$)
  imageUri?: string;
  createdAt: string; // ISO 8601
}

export interface Currency {
  id: string;
  name: string;
  rate: number; // Bolívares por 1 USD (> 0)
}

export interface PriceResult {
  currency: Currency;
  isReference: boolean;
  costEquivUSD: number;   // costo equivalente en USD según esta moneda: costoBs / currency.rate
  costVES: number;        // costo en Bs (siempre = costUSD × purchaseRate)
  salePriceUSD: number;   // precio venta en USD: costEquivUSD × (1 + profit/100)
  salePriceVES: number;   // precio venta en Bs: salePriceUSD × currency.rate
  adjustedCostUSD: number; // alias de costEquivUSD para compatibilidad
}

export interface ProductFormData {
  name: string;
  costUSD: string;
  profitPercent: string;
  purchaseRateId: string;  // id de la moneda de compra
  imageUri?: string;
}

export interface CurrencyFormData {
  name: string;
  rate: string;
}

export interface ProductValidationErrors {
  name?: string;
  costUSD?: string;
  profitPercent?: string;
  purchaseRateId?: string;
}

export interface CurrencyValidationErrors {
  name?: string;
  rate?: string;
}
