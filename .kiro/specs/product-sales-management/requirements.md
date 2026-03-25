# Requirements Document

## Introduction

Aplicación mobile (React Native / Expo) para gestión de productos con cálculo de precios en múltiples monedas venezolanas. El sistema permite registrar productos con su costo en USD, configurar tasas de cambio (Binance y BCV), y calcular automáticamente los precios de venta en bolívares para cada tasa, respetando la moneda de referencia más alta como base de costo real.

## Glossary

- **App**: La aplicación mobile de gestión de ventas de productos
- **Producto**: Item comercializable con nombre, imagen, costo de compra en USD y porcentaje de utilidad
- **Costo_USD**: Precio de compra del Producto expresado en dólares estadounidenses
- **Utilidad**: Porcentaje de ganancia aplicado sobre el costo ajustado del Producto
- **Moneda**: Tasa de cambio configurada que expresa cuántos bolívares equivalen a 1 USD (ej. Binance, BCV)
- **Tasa_Binance**: Tasa de cambio USD→VES obtenida de Binance P2P (ej. 40 Bs/USD)
- **Tasa_BCV**: Tasa de cambio USD→VES publicada por el Banco Central de Venezuela (ej. 30 Bs/USD)
- **Moneda_Referencia**: La Moneda con la tasa más alta (más bolívares por dólar), usada como base para calcular el costo real en monedas más bajas
- **Costo_Ajustado**: Costo real en USD cuando se paga con una Moneda cuya tasa es menor que la Moneda_Referencia; se calcula como Costo_USD × (Tasa_Referencia / Tasa_Moneda)
- **Precio_Venta_USD**: Precio de venta del Producto en USD para una Moneda dada, calculado como Costo_Ajustado × (1 + Utilidad / 100)
- **Precio_Venta_VES**: Precio de venta del Producto en bolívares para una Moneda dada, calculado como Precio_Venta_USD × Tasa_Moneda
- **Tab**: Sección de navegación inferior de la interfaz

## Requirements

### Requirement 1: Navegación por Tabs

**User Story:** Como usuario, quiero navegar entre secciones mediante una barra inferior con 3 tabs, para acceder fácilmente a las funcionalidades principales.

#### Acceptance Criteria

1. THE App SHALL proporcionar una barra de navegación inferior con exactamente 3 Tabs
2. THE App SHALL mostrar en el Tab 1 (Home) el listado de todos los Productos registrados
3. THE App SHALL mostrar en el Tab 2 la gestión de Monedas (tasas de cambio)
4. THE App SHALL mostrar en el Tab 3 la configuración general de la App
5. WHEN el usuario selecciona un Tab, THE App SHALL mostrar el contenido correspondiente a ese Tab
6. THE App SHALL indicar visualmente cuál Tab está activo en cada momento

---

### Requirement 2: Gestión de Productos

**User Story:** Como usuario, quiero crear y gestionar productos con su información básica, para mantener un catálogo actualizado.

#### Acceptance Criteria

1. THE App SHALL permitir crear un Producto con los campos: nombre, Costo_USD, imagen y Utilidad
2. THE App SHALL permitir listar todos los Productos registrados en el Tab Home
3. THE App SHALL permitir editar la información de un Producto existente
4. THE App SHALL permitir eliminar un Producto existente
5. WHEN se crea un Producto, THE App SHALL asignar un identificador único al Producto
6. THE App SHALL validar que el nombre del Producto no esté vacío
7. THE App SHALL validar que el Costo_USD sea un valor numérico positivo
8. THE App SHALL validar que la Utilidad sea un valor numérico entre 0 y 1000 por ciento
9. WHEN la validación falla al crear o editar un Producto, THE App SHALL mostrar mensajes de error específicos por campo

---

### Requirement 3: Gestión de Monedas (Tasas de Cambio)

**User Story:** Como usuario, quiero configurar las tasas de cambio disponibles (Binance, BCV u otras), para que el sistema calcule precios en cada una.

#### Acceptance Criteria

1. THE App SHALL permitir registrar una Moneda con nombre (ej. "Binance", "BCV") y valor de tasa en VES por USD
2. THE App SHALL permitir listar todas las Monedas configuradas
3. THE App SHALL permitir editar el valor de tasa de una Moneda existente
4. THE App SHALL permitir eliminar una Moneda existente
5. THE App SHALL validar que el nombre de la Moneda no esté vacío
6. THE App SHALL validar que el valor de tasa sea un número positivo mayor que cero
7. WHEN se actualiza el valor de tasa de una Moneda, THE App SHALL recalcular automáticamente los precios de todos los Productos

---

### Requirement 4: Cálculo de Moneda de Referencia

**User Story:** Como usuario, quiero que el sistema identifique automáticamente la moneda con la tasa más alta como referencia, para que los cálculos de costo ajustado sean correctos.

#### Acceptance Criteria

1. THE App SHALL identificar como Moneda_Referencia la Moneda con el mayor valor de tasa entre todas las Monedas configuradas
2. WHEN solo existe una Moneda configurada, THE App SHALL usar esa Moneda como Moneda_Referencia
3. WHEN se agrega o modifica una Moneda, THE App SHALL recalcular cuál es la Moneda_Referencia
4. THE App SHALL mostrar visualmente cuál Moneda es la Moneda_Referencia en la pantalla de detalle del Producto

---

### Requirement 5: Cálculo de Precios por Moneda

**User Story:** Como usuario, quiero ver el costo de compra y el precio de venta de cada producto en cada moneda configurada, para saber exactamente cuánto cobrar según el método de pago del cliente.

#### Acceptance Criteria

1. THE App SHALL calcular el Costo_Ajustado para cada Moneda como: Costo_USD × (Tasa_Referencia / Tasa_Moneda)
2. WHEN la Moneda es la Moneda_Referencia, THE App SHALL usar el Costo_USD directamente como Costo_Ajustado (ratio = 1)
3. THE App SHALL calcular el Precio_Venta_USD para cada Moneda como: Costo_Ajustado × (1 + Utilidad / 100)
4. THE App SHALL calcular el Precio_Venta_VES para cada Moneda como: Precio_Venta_USD × Tasa_Moneda
5. THE App SHALL mostrar en el detalle del Producto, para cada Moneda: el Costo_Ajustado en USD, el Precio_Venta_USD y el Precio_Venta_VES
6. WHEN una Tasa_Moneda o la Utilidad del Producto cambia, THE App SHALL recalcular todos los precios del Producto

---

### Requirement 6: Detalle de Producto

**User Story:** Como usuario, quiero ver el detalle completo de un producto con todos sus precios por moneda, para tomar decisiones de venta informadas.

#### Acceptance Criteria

1. WHEN el usuario selecciona un Producto del listado, THE App SHALL navegar a la pantalla de detalle del Producto
2. THE App SHALL mostrar en el detalle: nombre, imagen, Costo_USD y Utilidad del Producto
3. THE App SHALL mostrar una sección por cada Moneda configurada con: nombre de la Moneda, Costo_Ajustado en USD, Precio_Venta_USD y Precio_Venta_VES
4. THE App SHALL indicar visualmente cuál Moneda es la Moneda_Referencia en el detalle del Producto
5. WHEN no hay Monedas configuradas, THE App SHALL mostrar un mensaje indicando que se deben configurar tasas de cambio

---

### Requirement 7: Ejemplo de Cálculo (Caso de Uso Concreto)

**User Story:** Como usuario, quiero que el sistema aplique correctamente la lógica de precio ajustado por moneda, para no perder dinero al recibir pagos en monedas con tasa inferior a la de referencia.

#### Acceptance Criteria

1. WHEN Tasa_Binance = 40 Bs/USD, Tasa_BCV = 30 Bs/USD y Costo_USD = 1 USD con Utilidad = 10%, THE App SHALL calcular:
   - Moneda_Referencia = Binance (tasa más alta)
   - Costo_Ajustado Binance = 1 USD (ratio 40/40 = 1)
   - Costo_Ajustado BCV = 1 × (40/30) = 1.33 USD
   - Precio_Venta_USD Binance = 1 × 1.10 = 1.10 USD
   - Precio_Venta_USD BCV = 1.33 × 1.10 = 1.46 USD
   - Precio_Venta_VES Binance = 1.10 × 40 = 44 Bs
   - Precio_Venta_VES BCV = 1.46 × 30 = 43.8 Bs
2. THE App SHALL mostrar los valores calculados con precisión de 2 decimales

---

### Requirement 8: Persistencia de Datos

**User Story:** Como usuario, quiero que mis productos y tasas de cambio se guarden localmente, para no perder la información al cerrar la aplicación.

#### Acceptance Criteria

1. THE App SHALL persistir todos los Productos en almacenamiento local del dispositivo
2. THE App SHALL persistir todas las Monedas configuradas en almacenamiento local del dispositivo
3. WHEN la App se reinicia, THE App SHALL cargar los Productos y Monedas previamente guardados
4. IF ocurre un error al leer los datos persistidos, THEN THE App SHALL iniciar con datos vacíos y mostrar un mensaje de error al usuario
