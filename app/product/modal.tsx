import { ProductForm } from '@/components/product-form';
import { useCurrencies } from '@/context/currencies-context';
import { useProducts } from '@/context/products-context';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductModal() {
  const { id, name, costUSD, profitPercent, purchaseRateId, imageUri } =
    useLocalSearchParams<{
      id?: string;
      name?: string;
      costUSD?: string;
      profitPercent?: string;
      purchaseRateId?: string;
      imageUri?: string;
    }>();

  const isEditing = !!id;
  const { addProduct, updateProduct } = useProducts();
  const { currencies } = useCurrencies();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar producto' : 'Nuevo producto',
    });
  }, [isEditing, navigation]);

  function handleSubmit(data: Parameters<typeof addProduct>[0]) {
    if (isEditing && id) {
      updateProduct(id, data, currencies);
    } else {
      addProduct(data, currencies);
    }
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <ProductForm
          currencies={currencies}
          initialValues={
            isEditing
              ? {
                  name: name ?? '',
                  costUSD: costUSD ?? '',
                  profitPercent: profitPercent ?? '',
                  purchaseRateId: purchaseRateId ?? '',
                  imageUri: imageUri ?? undefined,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1 },
});
