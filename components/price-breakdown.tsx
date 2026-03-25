import type { PriceResult } from '@/types/index';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PriceBreakdownProps {
  results: PriceResult[];
}

function fmt(n: number, decimals = 2): string {
  return n.toLocaleString('es-VE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function PriceBreakdown({ results }: PriceBreakdownProps) {
  if (results.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Precios por moneda</Text>
      {results.map((result) => (
        <View key={result.currency.id} style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.currencyName}>{result.currency.name}</Text>
            <Text style={styles.rateLabel}>{fmt(result.currency.rate)} Bs/$</Text>
          </View>

          <View style={styles.divider} />

          {/* Costo equivalente */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Costo equivalente</Text>
            <View style={styles.rowValues}>
              <Text style={styles.valueUSD}>${fmt(result.costEquivUSD)}</Text>
              <Text style={styles.valueVES}>{fmt(result.costVES)} Bs</Text>
            </View>
          </View>

          {/* Precio de venta */}
          <View style={[styles.row, styles.salePriceRow]}>
            <Text style={styles.salePriceLabel}>Precio de venta</Text>
            <View style={styles.rowValues}>
              <Text style={styles.salePriceUSD}>${fmt(result.salePriceUSD)}</Text>
              <Text style={styles.salePriceVES}>{fmt(result.salePriceVES)} Bs</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#11181C',
  },
  rateLabel: {
    fontSize: 13,
    color: '#687076',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowLabel: {
    fontSize: 13,
    color: '#687076',
  },
  rowValues: {
    alignItems: 'flex-end',
    gap: 2,
  },
  valueUSD: {
    fontSize: 13,
    color: '#687076',
    fontWeight: '500',
  },
  valueVES: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  salePriceRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 0,
  },
  salePriceLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#11181C',
  },
  salePriceUSD: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  salePriceVES: {
    fontSize: 13,
    fontWeight: '600',
    color: '#11181C',
  },
});
