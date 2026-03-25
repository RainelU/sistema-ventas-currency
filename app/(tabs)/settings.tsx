import { useSettings, type ProfitMode, type ThemeMode } from '@/context/settings-context';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function OptionGroup({
  label,
  description,
  options,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: any) => void;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      {description && <Text style={styles.groupDesc}>{description}</Text>}
      <View style={styles.optionRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.optionBtn, value === opt.value && styles.optionBtnActive]}
            onPress={() => onChange(opt.value)}
          >
            <Text style={[styles.optionText, value === opt.value && styles.optionTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { profitMode, themeMode, setProfitMode, setThemeMode } = useSettings();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración</Text>
      </View>

      <View style={styles.content}>
        <OptionGroup
          label="Modo de ganancia"
          description={
            profitMode === 'margin'
              ? 'Margen: % sobre el precio de venta. precio = costo / (1 - margen)'
              : 'Markup: % sobre el costo. precio = costo × (1 + markup)'
          }
          options={[
            { value: 'margin', label: '% Margen' },
            { value: 'markup', label: '% Markup' },
          ]}
          value={profitMode}
          onChange={(v: ProfitMode) => setProfitMode(v)}
        />

        <OptionGroup
          label="Tema"
          options={[
            { value: 'system', label: 'Sistema' },
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Oscuro' },
          ]}
          value={themeMode}
          onChange={(v: ThemeMode) => setThemeMode(v)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: 24, fontWeight: '700', color: '#11181C' },
  content: { padding: 16, gap: 24 },
  group: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  groupLabel: { fontSize: 15, fontWeight: '700', color: '#11181C', marginBottom: 4 },
  groupDesc: { fontSize: 12, color: '#687076', marginBottom: 12, lineHeight: 18 },
  optionRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  optionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  optionBtnActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  optionText: { fontSize: 14, color: '#687076', fontWeight: '500' },
  optionTextActive: { color: '#fff', fontWeight: '700' },
});
