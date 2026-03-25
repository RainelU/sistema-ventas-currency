import type { CurrencyFormData, CurrencyValidationErrors } from '@/types/index';
import { validateCurrency } from '@/utils/validators';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CurrencyFormProps {
  initialValues?: { name: string; rate: string };
  onSubmit: (data: CurrencyFormData) => void;
  onCancel: () => void;
}

export function CurrencyForm({ initialValues, onSubmit, onCancel }: CurrencyFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [rate, setRate] = useState(initialValues?.rate ?? '');
  const [errors, setErrors] = useState<CurrencyValidationErrors>({});

  function handleSubmit() {
    const data: CurrencyFormData = { name, rate };
    const validationErrors = validateCurrency(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(data);
  }

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          value={name}
          onChangeText={(v) => { setName(v); setErrors((e) => ({ ...e, name: undefined })); }}
          placeholder="Ej. Dólar"
          placeholderTextColor="#9BA1A6"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tasa (Bs/USD)</Text>
        <TextInput
          style={[styles.input, errors.rate ? styles.inputError : null]}
          value={rate}
          onChangeText={(v) => { setRate(v); setErrors((e) => ({ ...e, rate: undefined })); }}
          placeholder="Ej. 36.50"
          placeholderTextColor="#9BA1A6"
          keyboardType="decimal-pad"
        />
        {errors.rate && <Text style={styles.errorText}>{errors.rate}</Text>}
      </View>

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
  container: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 6,
  },
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
  inputError: {
    borderColor: '#e53e3e',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 12,
    marginTop: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelText: {
    color: '#687076',
    fontSize: 15,
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
