import type { Product } from '@/types/index';
import { Image } from 'expo-image';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductCard({ product, onPress, onEdit, onDelete }: ProductCardProps) {
  function handleDelete(e: any) {
    e.stopPropagation();
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de que quieres eliminar "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onDelete },
      ]
    );
  }
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {product.imageUri ? (
        <Image source={{ uri: product.imageUri }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.cost}>${product.costUSD.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={(e) => { e.stopPropagation(); onEdit(); }}
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: 72,
    height: 72,
  },
  placeholder: {
    backgroundColor: '#D1D5DB',
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  cost: {
    fontSize: 14,
    color: '#687076',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 12,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  editText: {
    color: '#0a7ea4',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e53e3e',
  },
  deleteText: {
    color: '#e53e3e',
    fontSize: 12,
    fontWeight: '500',
  },
});
