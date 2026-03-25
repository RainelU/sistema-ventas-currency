import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  PRODUCTS: '@psm/products',
  CURRENCIES: '@psm/currencies',
} as const;

export async function loadData<T>(key: string): Promise<T[]> {
  try {
    const json = await AsyncStorage.getItem(key);
    if (json === null) return [];
    return JSON.parse(json) as T[];
  } catch {
    return [];
  }
}

export async function saveData<T>(key: string, data: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[storage] Error saving data for key "${key}":`, error);
  }
}
