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

interface ProductFormProps {
  initialValues?: {
    name: string;
    costUSD: string;
    profitPercent: string;
    purchaseRateId: string;
    purchaseRate: string;
    imageUri?: string;
  };
  currencies: Currency[];
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductForm({ initialValues, currencies, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [costUSD, setCostUSD] = useState(initialValues?.costUSD ?? '');
  const [profitPercent, setProfitPercent] = useState(initialValues?.profitPercent ?? '');
  const [purchaseRateId, setPurchaseRateId] = useState(initialValues?.purchaseRateId ?? '');
  const [purchaseRate, setPurchaseRate] = useState(initialValues?.purchaseRate ?? '');
  const [imageUri, setImageUri] = useState<string | undefined>(initialValues?.imageUri);
  const [errors, setErrors] = useState<ProductValidationErrors>({});

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }

  function handleSelectCurrency(currency: Currency) {
    setPurchaseRateId(currency.id);
    // Pre-fill the rate with the current rate of the selected currency
    setPurchaseRate(currency.rate.toString());
    setErrors((e) => ({ ...e, purchaseRateId: undefined, purchaseRate: undefined }));
  }

  function handleSubmit() {
    const data: ProductFormData = { name, costUSD, profitPercent, purchaseRateId, purchaseRate, imageUri };
    const validationErrors = validateProduct(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(data);
  }

  const selectedCurrency = currencies.find((c) => c.id === purchaseRateId);

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
          onChangeText={(v) => { setCostUSD(v); setErrors((e) => ({ ...e, costUSD: undefined })); }}
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
          <Text style={styles.noCurrenciesText}>
            No hay monedas configuradas. Agrégalas en la pestaña Monedas.
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
            {currencies.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.currencyChip,
                  purchaseRateId === c.id && styles.currencyChipSelected,
                ]}
                onPress={() => handleSelectCurrency(c)}
              >
                <Text style={[
                  styles.currencyChipText,
                  purchaseRateId === c.id && styles.currencyChipTextSelected,
                ]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {errors.purchaseRateId && <Text style={styles.errorText}>{errors.purchaseRateId}</Text>}
      </View>

      {/* Tasa de compra */}
      {selectedCurrency && (
        <View style={styles.field}>
          <Text style={styles.label}>
            Tasa de compra — {selectedCurrency.name} (Bs/$)
          </Text>
          <TextInput
            style={[styles.input, errors.purchaseRate ? styles.inputError : null]}
            value={purchaseRate}
            onChangeText={(v) => { setPurchaseRate(v); setErrors((e) => ({ ...e, purchaseRate: undefined })); }}
            placeholder={`Tasa actual: ${selectedCurrency.rate}`}
            placeholderTextColor="#9BA1A6"
            keyboardType="decimal-pad"
          />
          <Text style={styles.hint}>
            Tasa actual configurada: {selectedCurrency.rate} Bs/$. Puedes ajustarla si cambió.
          </Text>
          {errors.purchaseRate && <Text style={styles.errorText}>{errors.purchaseRate}</Text>}
        </View>
      )}

      {/* Ganancia */}
      <View style={styles.field}>
        <Text style={styles.label}>Ganancia (%)</Text>
        <TextInput
          style={[styles.input, errors.profitPercent ? styles.inputError : null]}
          value={profitPercent}
          onChangeText={(v) => { setProfitPercent(v); setErrors((e) => ({ ...e, profitPercent: undefined })); }}
          placeholder="Ej. 30"
          placeholderTextColor="#9BA1A6"
          keyboardType="decimal-pad"
        />
        {errors.profitPercent && <Text style={styles.errorText}>{errors.profitPercent}</Text>}
      </View>

      {/* Imagen */}
      <View style={styles.field}>
        <Text style={styles.label}>Imagen</Text>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.preview} contentFit="cover" />
        )}
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
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#11181C',
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#e53e3e' },
  errorText: { color: '#e53e3e', fontSize: 12, marginTop: 4 },
  hint: { color: '#9BA1A6', fontSize: 12, marginTop: 4 },
  noCurrenciesText: { color: '#e53e3e', fontSize: 13 },
  currencyScroll: { flexDirection: 'row', marginBottom: 4 },
  currencyChip: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  currencyChipSelected: {
    borderColor: '#0a7ea4',
    backgroundColor: '#0a7ea4',
  },
  currencyChipText: { fontSize: 14, color: '#687076', fontWeight: '500' },
  currencyChipTextSelected: { color: '#fff' },
  preview: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#D1D5DB',
  },
  imageButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  imageButtonText: { color: '#0a7ea4', fontSize: 14, fontWeight: '500' },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelText: { color: '#687076', fontSize: 15, fontWeight: '500' },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
  },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
