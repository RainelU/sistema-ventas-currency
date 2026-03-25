import type { Currency } from '@/types/index';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CurrencyCardProps {
  currency: Currency;
  isReference: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function CurrencyCard({ currency, onEdit, onDelete }: CurrencyCardProps) {
  function handleDelete() {
    Alert.alert(
      'Eliminar moneda',
      `¿Estás seguro de que quieres eliminar "${currency.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onDelete },
      ]
    );
  }
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{currency.name}</Text>
        </View>
        <Text style={styles.rate}>{currency.rate} Bs/USD</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  badge: {
    backgroundColor: '#0a7ea4',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  rate: {
    fontSize: 14,
    color: '#687076',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  editText: {
    color: '#0a7ea4',
    fontSize: 13,
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e53e3e',
  },
  deleteText: {
    color: '#e53e3e',
    fontSize: 13,
    fontWeight: '500',
  },
});
