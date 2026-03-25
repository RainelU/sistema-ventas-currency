# Implementation Plan: Product Sales Management

## Overview

Implementación incremental de la app Expo/React Native para gestión de productos con cálculo de precios en múltiples monedas venezolanas. Cada tarea construye sobre la anterior, terminando con la integración completa del flujo.

## Tasks

- [x] 1. Instalar dependencias y configurar entorno
  - Ejecutar `npx expo install @react-native-async-storage/async-storage expo-image-picker`
  - Ejecutar `npm install --save-dev fast-check`
  - Verificar que las dependencias aparecen en `package.json`
  - _Requirements: 8.1, 8.2_

- [x] 2. Definir tipos TypeScript en `types/index.ts`
  - [x] 2.1 Crear `types/index.ts` con las interfaces `Product`, `Currency`, `PriceResult`, `ProductFormData`, `CurrencyFormData`, `ProductValidationErrors`, `CurrencyValidationErrors`
    - Seguir exactamente el modelo de datos del diseño
    - _Requirements: 2.1, 2.5, 3.1, 5.1_

- [x] 3. Implementar utilidades base
  - [x] 3.1 Crear `utils/storage.ts` con `STORAGE_KEYS` y helpers tipados `loadData<T>` / `saveData<T>` sobre AsyncStorage
    - Manejar errores de lectura/escritura con try/catch
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 3.2 Crear `utils/price-calculator.ts` con la función pura `calculatePrices(costUSD, profitPercent, currencies)` y helper `round2`
    - Implementar lógica: refRate = max(rates), adjustedCostUSD, salePriceUSD, salePriceVES
    - _Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2_

  - [x] 3.3 Crear `utils/validators.ts` con `validateProduct(data: ProductFormData)` y `validateCurrency(data: CurrencyFormData)`
    - Validar nombre no vacío/en blanco, costUSD > 0, profitPercent en [0, 1000], rate > 0
    - Retornar objetos `ProductValidationErrors` / `CurrencyValidationErrors`
    - _Requirements: 2.6, 2.7, 2.8, 2.9, 3.5, 3.6_

  - [ ]* 3.4 Escribir property tests para `calculatePrices` (fast-check)
    - **Property 1: Moneda de referencia es la de mayor tasa**
    - **Validates: Requirements 4.1, 4.2**
    - **Property 2: Costo ajustado de la moneda de referencia es igual al costo original**
    - **Validates: Requirements 5.2**
    - **Property 5: salePriceVES = salePriceUSD × currency.rate**
    - **Validates: Requirements 5.4**
    - **Property 9: Caso concreto Binance 40, BCV 30, costo 1 USD, utilidad 10%**
    - **Validates: Requirements 7.1, 7.2**
    - Archivo: `utils/__tests__/price-calculator.test.ts`

  - [ ]* 3.5 Escribir property tests para validadores (fast-check)
    - **Property 6: Validación rechaza nombres vacíos o en blanco**
    - **Validates: Requirements 2.6, 3.5**
    - **Property 7: Validación rechaza costos y tasas no positivos**
    - **Validates: Requirements 2.7, 3.6**
    - **Property 8: Utilidad fuera de rango [0, 1000] es rechazada**
    - **Validates: Requirements 2.8**
    - Archivo: `utils/__tests__/validators.test.ts`

  - [ ]* 3.6 Escribir property tests de round-trip para storage helpers (fast-check)
    - **Property 3: Round-trip de serialización de productos**
    - **Validates: Requirements 8.1, 8.3**
    - **Property 4: Round-trip de serialización de monedas**
    - **Validates: Requirements 8.2, 8.3**
    - Archivo: `utils/__tests__/storage.test.ts`

- [x] 4. Checkpoint — Verificar utilidades
  - Asegurarse de que todos los tests de utilidades pasan. Consultar al usuario si hay dudas.

- [x] 5. Implementar contextos de estado global
  - [x] 5.1 Crear `context/currencies-context.tsx` con `CurrenciesProvider`, reducer, carga/persistencia AsyncStorage y `referenceCurrency`
    - Exponer: `currencies`, `loading`, `error`, `addCurrency`, `updateCurrency`, `deleteCurrency`, `referenceCurrency`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7, 4.1, 4.3, 8.2, 8.3, 8.4_

  - [x] 5.2 Crear `context/products-context.tsx` con `ProductsProvider`, reducer, carga/persistencia AsyncStorage
    - Exponer: `products`, `loading`, `error`, `addProduct`, `updateProduct`, `deleteProduct`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.1, 8.3, 8.4_

  - [x] 5.3 Modificar `app/_layout.tsx` para envolver el Stack con `CurrenciesProvider` y `ProductsProvider`
    - Mantener `ThemeProvider` existente; orden: CurrenciesProvider > ProductsProvider > ThemeProvider > Stack
    - Registrar pantallas `product/[id]` y `product/modal` en el Stack
    - _Requirements: 1.1_

- [x] 6. Configurar navegación por tabs
  - [x] 6.1 Modificar `app/(tabs)/_layout.tsx` para mostrar exactamente 3 tabs: Home (index), Monedas (currencies), Configuración (settings)
    - Usar iconos apropiados de `@expo/vector-icons` o `expo-symbols`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 6.2 Crear `app/(tabs)/currencies.tsx` como pantalla vacía con título "Monedas" (se implementa en tarea 8)
    - _Requirements: 1.3_

  - [x] 6.3 Crear `app/(tabs)/settings.tsx` como pantalla con título "Configuración" y contenido placeholder
    - _Requirements: 1.4_

- [x] 7. Implementar componentes UI reutilizables
  - [x] 7.1 Crear `components/empty-state.tsx` con props `message`, `actionLabel?`, `onAction?`
    - _Requirements: 2.2, 3.2, 6.5_

  - [x] 7.2 Crear `components/currency-card.tsx` con props `currency`, `isReference`, `onEdit`, `onDelete`
    - Mostrar badge "Referencia" cuando `isReference === true`
    - _Requirements: 3.2, 4.4_

  - [x] 7.3 Crear `components/currency-form.tsx` con campos nombre y tasa, validación inline y mensajes de error por campo
    - _Requirements: 3.1, 3.5, 3.6_

  - [x] 7.4 Crear `components/product-card.tsx` con props `product`, `onPress`, `onEdit`, `onDelete`
    - Mostrar imagen (expo-image), nombre y costo USD
    - _Requirements: 2.2, 6.1_

  - [x] 7.5 Crear `components/product-form.tsx` con campos nombre, costUSD, profitPercent, imageUri (TextInput + botón picker), validación inline
    - _Requirements: 2.1, 2.6, 2.7, 2.8, 2.9_

  - [x] 7.6 Crear `components/price-breakdown.tsx` con props `results: PriceResult[]`
    - Renderizar sección por moneda: nombre, costoAjustadoUSD, precioVentaUSD, precioVentaVES, badge referencia
    - _Requirements: 5.5, 6.3, 6.4_

- [x] 8. Implementar pantallas de gestión de monedas y detalle de producto
  - [x] 8.1 Implementar `app/(tabs)/currencies.tsx` con listado de monedas usando `CurrencyCard`, FAB para agregar, y modal/inline form con `CurrencyForm`
    - Conectar con `CurrenciesContext` para add/update/delete
    - Mostrar `EmptyState` cuando no hay monedas
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.3, 4.4_

  - [x] 8.2 Crear `app/product/[id].tsx` con detalle del producto: nombre, imagen, costUSD, profitPercent y sección `PriceBreakdown`
    - Calcular precios con `calculatePrices` usando currencies del contexto
    - Mostrar `EmptyState` si no hay monedas configuradas
    - Botón de editar que navega a `product/modal` con params del producto
    - _Requirements: 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 8.3 Crear `app/product/modal.tsx` como modal de creación/edición de producto usando `ProductForm`
    - Recibir params opcionales para modo edición; conectar con `ProductsContext`
    - _Requirements: 2.1, 2.3, 2.6, 2.7, 2.8, 2.9_

- [x] 9. Implementar pantalla Home (Tab 1)
  - [x] 9.1 Reemplazar `app/(tabs)/index.tsx` con listado de productos usando `ProductCard` y FlatList
    - Mostrar `EmptyState` cuando no hay productos
    - FAB para navegar a `product/modal` (crear nuevo producto)
    - Al presionar una tarjeta, navegar a `product/[id]`
    - _Requirements: 1.2, 2.2, 2.4, 6.1_

- [x] 10. Checkpoint — Verificar flujo completo
  - Asegurarse de que todos los tests pasan. Verificar flujo: crear moneda → crear producto → ver detalle con precios → editar → eliminar. Consultar al usuario si hay dudas.

- [x] 11. Integración final
  - [x] 11.1 Verificar que `app/_layout.tsx` registra correctamente todas las rutas del Stack (`(tabs)`, `product/[id]`, `product/modal`)
    - Confirmar que los providers envuelven correctamente toda la app
    - _Requirements: 1.1, 1.5_

  - [x] 11.2 Verificar recálculo automático de precios al cambiar tasas de moneda
    - Confirmar que `ProductDetail` re-renderiza con nuevos precios cuando `CurrenciesContext` cambia
    - _Requirements: 3.7, 5.6_

  - [ ]* 11.3 Escribir smoke tests de componentes con `@testing-library/react-native`
    - Cubrir `EmptyState`, `CurrencyCard`, `ProductCard`, `PriceBreakdown`
    - _Requirements: 2.2, 3.2, 5.5_

- [x] 12. Checkpoint final — Asegurarse de que todos los tests pasan
  - Ejecutar suite completa de tests. Consultar al usuario si hay dudas antes de cerrar.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos para trazabilidad
- Los property tests usan `fast-check` con mínimo 100 iteraciones (`numRuns: 100`)
- Los unit tests usan Jest + `@testing-library/react-native` (incluidos con Expo)
- Los checkpoints validan el progreso incremental antes de continuar
