import type { CurrencyFormData, CurrencyValidationErrors, ProductFormData, ProductValidationErrors } from '@/types/index';

/** Normaliza separador decimal: reemplaza coma por punto */
function normalizeDecimal(value: string): string {
  return value.replace(',', '.');
}

export function validateProduct(data: ProductFormData): ProductValidationErrors {
  const errors: ProductValidationErrors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'El nombre no puede estar vacío.';
  }

  const cost = parseFloat(normalizeDecimal(data.costUSD));
  if (data.costUSD === '' || isNaN(cost) || cost <= 0) {
    errors.costUSD = 'El costo debe ser un número mayor a 0.';
  }

  const profit = parseFloat(normalizeDecimal(data.profitPercent));
  if (data.profitPercent === '' || isNaN(profit) || profit < 0 || profit >= 100) {
    errors.profitPercent = 'El margen debe ser un número entre 0 y 99.99%.';
  }

  if (!data.purchaseRateId || data.purchaseRateId.trim() === '') {
    errors.purchaseRateId = 'Selecciona la moneda con la que compraste.';
  }

  return errors;
}

export function validateCurrency(data: CurrencyFormData): CurrencyValidationErrors {
  const errors: CurrencyValidationErrors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'El nombre no puede estar vacío.';
  }

  const rate = parseFloat(normalizeDecimal(data.rate));
  if (data.rate === '' || isNaN(rate) || rate <= 0) {
    errors.rate = 'La tasa debe ser un número mayor a 0.';
  }

  return errors;
}
