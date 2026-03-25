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
  if (data.profitPercent === '' || isNaN(profit) || profit < 0 || profit > 1000) {
    errors.profitPercent = 'El porcentaje de ganancia debe ser un número entre 0 y 1000.';
  }

  if (!data.purchaseRateId || data.purchaseRateId.trim() === '') {
    errors.purchaseRateId = 'Selecciona la moneda con la que compraste.';
  }

  const rate = parseFloat(normalizeDecimal(data.purchaseRate));
  if (data.purchaseRate === '' || isNaN(rate) || rate <= 0) {
    errors.purchaseRate = 'La tasa de compra debe ser un número mayor a 0.';
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
