import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Bandera de Venezuela con 7 estrellas — solo visual, decorativa.
 * Franjas: amarillo (arriba), azul (medio), rojo (abajo).
 * 7 estrellas blancas en la franja azul.
 */
export function VenezuelaFlag({ size = 28 }: { size?: number }) {
  const width = size * 1.6;
  const height = size;
  const stripeH = height / 3;
  const stars = [1, 2, 3, 4, 5, 6, 7];

  return (
    <View style={[styles.flag, { width, height, borderRadius: size * 0.08 }]}>
      {/* Amarillo */}
      <View style={[styles.stripe, { height: stripeH, backgroundColor: '#FCE300' }]} />
      {/* Azul con 7 estrellas */}
      <View style={[styles.stripe, styles.blueStripe, { height: stripeH }]}>
        <View style={styles.starsRow}>
          {stars.map((_, i) => (
            <Text key={i} style={[styles.star, { fontSize: size * 0.15 }]}>★</Text>
          ))}
        </View>
      </View>
      {/* Rojo */}
      <View style={[styles.stripe, { height: stripeH, backgroundColor: '#EF3340' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  flag: {
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  stripe: {
    width: '100%',
  },
  blueStripe: {
    backgroundColor: '#003DA5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  star: {
    color: '#fff',
  },
});
