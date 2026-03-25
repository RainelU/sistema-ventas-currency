import { CurrencyCard } from '@/components/currency-card';
import { CurrencyForm } from '@/components/currency-form';
import { EmptyState } from '@/components/empty-state';
import { useCurrencies } from '@/context/currencies-context';
import type { Currency, CurrencyFormData } from '@/types/index';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CurrenciesScreen() {
  const { currencies, referenceCurrency, addCurrency, updateCurrency, deleteCurrency } =
    useCurrencies();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

  function openNew() {
    setEditingCurrency(null);
    setModalVisible(true);
  }

  function openEdit(currency: Currency) {
    setEditingCurrency(currency);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingCurrency(null);
  }

  function handleSubmit(data: CurrencyFormData) {
    if (editingCurrency) {
      updateCurrency(editingCurrency.id, data);
    } else {
      addCurrency(data);
    }
    closeModal();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Monedas</Text>
      </View>

      <View style={styles.container}>
        {currencies.length === 0 ? (
          <EmptyState
            message="No hay monedas configuradas"
            actionLabel="Agregar moneda"
            onAction={openNew}
          />
        ) : (
          <FlatList
            data={currencies}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <CurrencyCard
                currency={item}
                isReference={item.id === referenceCurrency?.id}
                onEdit={() => openEdit(item)}
                onDelete={() => deleteCurrency(item.id)}
              />
            )}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openNew}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Tap outside to close */}
          <Pressable style={styles.modalBackdrop} onPress={closeModal} />

          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
            <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
              <Text style={styles.modalTitle}>
                {editingCurrency ? 'Editar moneda' : 'Nueva moneda'}
              </Text>
              <CurrencyForm
                initialValues={
                  editingCurrency
                    ? { name: editingCurrency.name, rate: String(editingCurrency.rate) }
                    : undefined
                }
                onSubmit={handleSubmit}
                onCancel={closeModal}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#11181C',
  },
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#11181C',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
