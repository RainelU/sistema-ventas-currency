import { EmptyState } from '@/components/empty-state';
import { PriceBreakdown } from '@/components/price-breakdown';
import { useCurrencies } from '@/context/currencies-context';
import { useProducts } from '@/context/products-context';
import { useSettings } from '@/context/settings-context';
import { calculatePrices } from '@/utils/price-calculator';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/** margin % → markup % */
function marginToMarkup(marginPct: number): number {
  const m = marginPct / 100;
  if (m >= 1) return 0;
  return (m / (1 - m)) * 100;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { products } = useProducts();
  const { currencies } = useCurrencies();
  const { profitMode } = useSettings();

  const product = products.find((p) => p.id === id);

  // Display profit % in current mode
  const displayProfitPct = product
    ? profitMode === 'markup'
      ? marginToMarkup(product.profitPercent)
      : product.profitPercent
    : 0;

  useEffect(() => {
    if (!product) return;
    navigation.setOptions({
      title: product.name,
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/product/modal' as any,
              params: {
                id: product.id,
                name: product.name,
                costUSD: product.costUSD.toString(),
                profitPercent: product.profitPercent.toString(),
                purchaseRateId: product.purchaseRateId,
                imageUri: product.imageUri ?? '',
              },
            })
          }
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      ),
    });
  }, [product, navigation, router]);

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Producto no encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use current rate from context if currency still exists, fallback to stored rate
  const purchaseCurrency = currencies.find(c => c.id === product.purchaseRateId);
  const effectivePurchaseRate = purchaseCurrency?.rate ?? product.purchaseRate;
  const purchaseCurrencyName = purchaseCurrency?.name ?? 'Moneda eliminada';

  const priceResults = calculatePrices(product.costUSD, product.profitPercent, effectivePurchaseRate, currencies);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {product.imageUri ? (
        <Image source={{ uri: product.imageUri }} style={styles.image} contentFit="cover" />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      <View style={styles.details}>
        <Text style={styles.productName}>{product.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Costo</Text>
          <Text style={styles.infoValue}>${product.costUSD.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {profitMode === 'markup' ? 'Markup' : 'Margen'}
          </Text>
          <Text style={styles.infoValue}>{displayProfitPct.toFixed(2)}%</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tasa de compra</Text>
          <Text style={styles.infoValue}>{effectivePurchaseRate} Bs/$ ({purchaseCurrencyName})</Text>
        </View>

        <View style={styles.pricesSection}>
          {currencies.length === 0 ? (
            <EmptyState message="Configura tasas de cambio en la pestaña Monedas" />
          ) : (
            <PriceBreakdown results={priceResults} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { paddingBottom: 32 },
  image: { width: '100%', height: 220 },
  imagePlaceholder: { width: '100%', height: 220, backgroundColor: '#CCCCCC' },
  details: { padding: 16 },
  productName: { fontSize: 24, fontWeight: '700', color: '#11181C', marginBottom: 12 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: { fontSize: 14, color: '#687076' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#11181C' },
  pricesSection: { marginTop: 20 },
  editButton: { marginRight: 12 },
  editButtonText: { color: '#0a7ea4', fontSize: 16, fontWeight: '600' },
  notFoundContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 24 },
  notFoundText: { fontSize: 18, color: '#687076', marginBottom: 16 },
  backButton: { backgroundColor: '#0a7ea4', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  backButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
