import { EmptyState } from '@/components/empty-state';
import { ProductCard } from '@/components/product-card';
import { useProducts } from '@/context/products-context';
import { useSettings } from '@/context/settings-context';
import type { Product } from '@/types/index';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const { products, deleteProduct } = useProducts();
  const { profitMode } = useSettings();
  const router = useRouter();

  function handlePress(product: Product) {
    router.push({ pathname: '/product/[id]', params: { id: product.id } });
  }

  function handleEdit(product: Product) {
    router.push({
      pathname: '/product/modal',
      params: {
        id: product.id,
        name: product.name,
        costUSD: product.costUSD.toString(),
        profitPercent: product.profitPercent.toString(),
        purchaseRateId: product.purchaseRateId,
        imageUri: product.imageUri ?? '',
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>
            {profitMode === 'margin' ? '% Margen' : '% Markup'}
          </Text>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          products.length === 0 && styles.listContentEmpty,
        ]}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handlePress(item)}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteProduct(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            message="No tienes productos aún"
            actionLabel="Agregar producto"
            onAction={() => router.push('/product/modal')}
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/product/modal')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#11181C' },
  modeBadge: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingBottom: 80 },
  listContentEmpty: { flex: 1 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32, fontWeight: '400' },
});
