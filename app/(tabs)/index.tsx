import { EmptyState } from '@/components/empty-state';
import { ProductCard } from '@/components/product-card';
import { useProducts } from '@/context/products-context';
import { useSettings } from '@/context/settings-context';
import type { Product } from '@/types/index';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const { products, deleteProduct } = useProducts();
  const { profitMode } = useSettings();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase().trim();
    return products.filter(p => p.name.toLowerCase().includes(q));
  }, [products, query]);

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
      {/* Header — title shown in tab header, flag centered */}
      <View style={styles.subHeader}>
        <Text style={styles.title}>Productos</Text>
        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>
            {profitMode === 'margin' ? '% Margen' : '% Markup'}
          </Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar producto..."
          placeholderTextColor="#9BA1A6"
          clearButtonMode="while-editing"
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setQuery('')}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filtered.length === 0 && styles.listContentEmpty,
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
          query.trim() ? (
            <EmptyState message={`Sin resultados para "${query}"`} />
          ) : (
            <EmptyState
              message="No tienes productos aún"
              actionLabel="Agregar producto"
              onAction={() => router.push('/product/modal')}
            />
          )
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
    paddingTop: 12,
    paddingBottom: 8,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#11181C' },
  modeBadge: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#11181C',
  },
  clearBtn: { padding: 4 },
  clearBtnText: { color: '#9BA1A6', fontSize: 14 },
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
