import { useSettings } from '@/context/settings-context';
import type { Currency, ProductFormData, ProductValidationErrors } from '@/types/index';
import { validateProduct } from '@/utils/validators';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type ProfitMode = 'markup' | 'margin';

interface ProductFormProps {
  initialValues?: {
    name: string;
    costUSD: string;
    profitPercent: string; // stored as margin %
    purchaseRateId: string;
    imageUri?: string;
  };
  currencies: Currency[];
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

function n(v: string) { return parseFloat(v.replace(',', '.')); }

/** markup → margin: m = k/(1+k) */
function markupToMargin(markup: number): number { return markup / (1 + markup); }
/** margin → markup: k = m/(1-m) */
function marginToMarkup(margin: number): number { return margin / (1 - margin); }

/** sale price from cost using margin */
function saleFromMargin(cost: number, marginPct: number): number {
  const m = marginPct / 100;
  return m >= 1 ? 0 : cost / (1 - m);
}
/** sale price from cost using markup */
function saleFromMarkup(cost: number, markupPct: number): number {
  return cost * (1 + markupPct / 100);
}

export function ProductForm({ initialValues, currencies, onSubmit, onCancel }: ProductFormProps) {
  const { profitMode: globalMode } = useSettings();
  const [name, setName] = useState(initialValues?.name ?? '');
  const [costUSD, setCostUSD] = useState(initialValues?.costUSD ?? '');
  const mode = globalMode; // use global setting, no local toggle needed

  // profitInput stores the % in the current mode
  const [profitInput, setProfitInput] = useState(() => {
    const storedMargin = parseFloat(initialValues?.profitPercent ?? '');
    if (isNaN(storedMargin) || storedMargin <= 0) return '';
    // Convert stored margin to current mode for display
    if (globalMode === 'markup') {
      return (marginToMarkup(storedMargin / 100) * 100).toFixed(2);
    }
    return storedMargin.toFixed(2);
  });

  const [salePriceUSD, setSalePriceUSD] = useState(() => {
    const cost = n(initialValues?.costUSD ?? '');
    const stored = parseFloat(initialValues?.profitPercent ?? '');
    if (!isNaN(cost) && !isNaN(stored) && cost > 0 && stored > 0 && stored < 100) {
      return saleFromMargin(cost, stored).toFixed(2);
    }
    return '';
  });

  const [purchaseRateId, setPurchaseRateId] = useState(initialValues?.purchaseRateId ?? '');
  const [imageUri, setImageUri] = useState<string | undefined>(initialValues?.imageUri);
  const [errors, setErrors] = useState<ProductValidationErrors>({});

  /** Convert profitInput to stored margin % regardless of current mode */
  function toMarginPct(input: string, currentMode: ProfitMode): number {
    const val = n(input);
    if (isNaN(val) || val <= 0) return NaN;
    if (currentMode === 'margin') return val;
    // markup → margin
    return markupToMargin(val / 100) * 100;
  }

  function recalcSale(cost: number, input: string, currentMode: ProfitMode) {
    const val = n(input);
    if (isNaN(cost) || cost <= 0 || isNaN(val) || val <= 0) { setSalePriceUSD(''); return; }
    const sale = currentMode === 'margin' ? saleFromMargin(cost, val) : saleFromMarkup(cost, val);
    setSalePriceUSD(sale > 0 ? sale.toFixed(2) : '');
  }

  function recalcProfit(cost: number, sale: number, currentMode: ProfitMode) {
    if (isNaN(cost) || cost <= 0 || isNaN(sale) || sale <= cost) { setProfitInput(''); return; }
    if (currentMode === 'margin') {
      const m = (1 - cost / sale) * 100;
      setProfitInput(m.toFixed(2));
    } else {
      const k = ((sale - cost) / cost) * 100;
      setProfitInput(k.toFixed(2));
    }
  }

  function handleCostChange(v: string) {
    setCostUSD(v);
    setErrors((e) => ({ ...e, costUSD: undefined }));
    recalcSale(n(v), profitInput, mode);
  }

  function handleProfitChange(v: string) {
    setProfitInput(v);
    setErrors((e) => ({ ...e, profitPercent: undefined }));
    recalcSale(n(costUSD), v, mode);
  }

  function handleSalePriceChange(v: string) {
    setSalePriceUSD(v);
    setErrors((e) => ({ ...e, profitPercent: undefined }));
    recalcProfit(n(costUSD), n(v), mode);
  }

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) setImageUri(result.assets[0].uri);
  }

  function handleSelectCurrency(currency: Currency) {
    setPurchaseRateId(currency.id);
    setErrors((e) => ({ ...e, purchaseRateId: undefined }));
  }

  function handleSubmit() {
    // Always store as margin %
    const marginPct = toMarginPct(profitInput, mode);
    const storedProfit = isNaN(marginPct) ? '' : marginPct.toFixed(4);
    const data: ProductFormData = { name, costUSD, profitPercent: storedProfit, purchaseRateId, imageUri };
    const validationErrors = validateProduct(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(data);
  }

  const selectedCurrency = currencies.find((c) => c.id === purchaseRateId);
  const profitLabel = mode === 'margin' ? 'Margen (%)' : 'Markup (%)';
  const profitPlaceholder = mode === 'margin' ? 'Ej. 27.6' : 'Ej. 38.1';

  return (
    <View style={styles.container}>
      {/* Nombre */}
      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          value={name}
          onChangeText={(v) => { setName(v); setErrors((e) => ({ ...e, name: undefined })); }}
          placeholder="Ej. Llanta"
          placeholderTextColor="#9BA1A6"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Costo USD */}
      <View style={styles.field}>
        <Text style={styles.label}>Costo (USD)</Text>
        <TextInput
          style={[styles.input, errors.costUSD ? styles.inputError : null]}
          value={costUSD}
          onChangeText={handleCostChange}
          placeholder="Ej. 15.00"
          placeholderTextColor="#9BA1A6"
          keyboardType="decimal-pad"
        />
        {errors.costUSD && <Text style={styles.errorText}>{errors.costUSD}</Text>}
      </View>

      {/* Moneda de compra */}
      <View style={styles.field}>
        <Text style={styles.label}>Moneda de compra</Text>
        {currencies.length === 0 ? (
          <Text style={styles.noCurrenciesText}>No hay monedas configuradas. Agrégalas en la pestaña Monedas.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
            {currencies.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.currencyChip, purchaseRateId === c.id && styles.currencyChipSelected]}
                onPress={() => handleSelectCurrency(c)}
              >
                <Text style={[styles.currencyChipText, purchaseRateId === c.id && styles.currencyChipTextSelected]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {errors.purchaseRateId && <Text style={styles.errorText}>{errors.purchaseRateId}</Text>}
      </View>

      {/* Tasa de compra — solo informativa */}
      {selectedCurrency && (
        <View style={styles.field}>
          <View style={styles.rateInfo}>
            <Text style={styles.rateInfoLabel}>Tasa actual de {selectedCurrency.name}</Text>
            <Text style={styles.rateInfoValue}>{selectedCurrency.rate} Bs/$</Text>
          </View>
          <Text style={styles.hint}>Esta tasa se guardará con el producto. Para modificarla ve a la pestaña Monedas.</Text>
        </View>
      )}

      {/* Ganancia — bidireccional, modo desde Configuración */}
      <View style={styles.field}>
        <View style={styles.profitHeader}>
          <Text style={styles.label}>Ganancia</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>{mode === 'margin' ? '% Margen' : '% Markup'}</Text>
          </View>
        </View>
        <Text style={styles.hint}>
          {mode === 'margin'
            ? 'Margen: % sobre el precio de venta. precio = costo / (1 - margen)'
            : 'Markup: % sobre el costo. precio = costo × (1 + markup)'}
        </Text>
        <View style={styles.profitRow}>
          <View style={styles.profitField}>
            <Text style={styles.sublabel}>{profitLabel}</Text>
            <TextInput
              style={[styles.input, errors.profitPercent ? styles.inputError : null]}
              value={profitInput}
              onChangeText={handleProfitChange}
              placeholder={profitPlaceholder}
              placeholderTextColor="#9BA1A6"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.profitSeparator}>
            <Text style={styles.profitSeparatorText}>↔</Text>
          </View>
          <View style={styles.profitField}>
            <Text style={styles.sublabel}>Precio venta (USD)</Text>
            <TextInput
              style={[styles.input, errors.profitPercent ? styles.inputError : null]}
              value={salePriceUSD}
              onChangeText={handleSalePriceChange}
              placeholder="Ej. 20.00"
              placeholderTextColor="#9BA1A6"
              keyboardType="decimal-pad"
            />
          </View>
        </View>
        {errors.profitPercent && <Text style={styles.errorText}>{errors.profitPercent}</Text>}
      </View>

      {/* Imagen */}
      <View style={styles.field}>
        <Text style={styles.label}>Imagen</Text>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} contentFit="cover" />}
        <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
          <Text style={styles.imageButtonText}>Seleccionar imagen</Text>
        </TouchableOpacity>
      </View>

      {/* Botones */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#11181C', marginBottom: 6 },
  sublabel: { fontSize: 12, color: '#687076', marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 15,
    color: '#11181C', backgroundColor: '#fff',
  },
  inputError: { borderColor: '#e53e3e' },
  errorText: { color: '#e53e3e', fontSize: 12, marginTop: 4 },
  hint: { color: '#9BA1A6', fontSize: 12, marginTop: 4, marginBottom: 8 },
  rateInfo: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#F0F9FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#BAE6FD',
  },
  rateInfoLabel: { fontSize: 14, color: '#0369A1', fontWeight: '500' },
  rateInfoValue: { fontSize: 16, color: '#0369A1', fontWeight: '700' },
  noCurrenciesText: { color: '#e53e3e', fontSize: 13 },
  currencyScroll: { flexDirection: 'row', marginBottom: 4 },
  currencyChip: {
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, backgroundColor: '#fff',
  },
  currencyChipSelected: { borderColor: '#0a7ea4', backgroundColor: '#0a7ea4' },
  currencyChipText: { fontSize: 14, color: '#687076', fontWeight: '500' },
  currencyChipTextSelected: { color: '#fff' },
  profitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  modeBadge: { backgroundColor: '#0a7ea4', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  modeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  profitRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  profitField: { flex: 1 },
  profitSeparator: { paddingBottom: 10 },
  profitSeparatorText: { fontSize: 18, color: '#9BA1A6' },
  preview: { width: '100%', height: 160, borderRadius: 8, marginBottom: 8, backgroundColor: '#D1D5DB' },
  imageButton: { borderWidth: 1, borderColor: '#0a7ea4', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  imageButtonText: { color: '#0a7ea4', fontSize: 14, fontWeight: '500' },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' },
  cancelText: { color: '#687076', fontSize: 15, fontWeight: '500' },
  saveButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#0a7ea4' },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
