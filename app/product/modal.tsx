import { ProductForm } from '@/components/product-form';
import { useCurrencies } from '@/context/currencies-context';
import { useProducts } from '@/context/products-context';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

export default function ProductModal() {
  const { id, name, costUSD, profitPercent, purchaseRateId, purchaseRate, imageUri } =
    useLocalSearchParams<{
      id?: string;
      name?: string;
      costUSD?: string;
      profitPercent?: string;
      purchaseRateId?: string;
      purchaseRate?: string;
      imageUri?: string;
    }>();

  const isEditing = !!id;
  const { addProduct, updateProduct } = useProducts();
  const { currencies } = useCurrencies();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar producto' : 'Nuevo producto',
    });
  }, [isEditing, navigation]);

  function handleSubmit(data: Parameters<typeof addProduct>[0]) {
    if (isEditing && id) {
      updateProduct(id, data);
    } else {
      addProduct(data);
    }
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ProductForm
          currencies={currencies}
          initialValues={
            isEditing
              ? {
                  name: name ?? '',
                  costUSD: costUSD ?? '',
                  profitPercent: profitPercent ?? '',
                  purchaseRateId: purchaseRateId ?? '',
                  purchaseRate: purchaseRate ?? '',
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
