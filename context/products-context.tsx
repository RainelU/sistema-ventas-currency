import { Currency, Product, ProductFormData } from '@/types/index';
import { loadData, saveData, STORAGE_KEYS } from '@/utils/storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

type ProductsAction =
  | { type: 'LOAD'; payload: Product[] }
  | { type: 'ADD'; payload: Product }
  | { type: 'UPDATE'; payload: Product }
  | { type: 'DELETE'; payload: string };

const initialState: ProductsState = { products: [], loading: true, error: null };

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD': return { ...state, products: action.payload, loading: false };
    case 'ADD': return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE': return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE': return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    default: return state;
  }
}

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (data: ProductFormData, currencies: Currency[]) => void;
  updateProduct: (id: string, data: ProductFormData, currencies: Currency[]) => void;
  deleteProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    loadData<Product>(STORAGE_KEYS.PRODUCTS).then(data => {
      dispatch({ type: 'LOAD', payload: data });
    });
  }, []);

  useEffect(() => {
    // Only persist after initial load is complete (loading === false)
    if (state.loading) return;
    saveData(STORAGE_KEYS.PRODUCTS, state.products);
  }, [state.products, state.loading]);

  const addProduct = useCallback((data: ProductFormData, currencies: Currency[]) => {
    const currency = currencies.find(c => c.id === data.purchaseRateId);
    const product: Product = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: data.name,
      costUSD: parseFloat(data.costUSD.replace(',', '.')),
      profitPercent: parseFloat(data.profitPercent.replace(',', '.')),
      purchaseRateId: data.purchaseRateId,
      purchaseRate: currency?.rate ?? 1,
      imageUri: data.imageUri,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD', payload: product });
  }, []);

  const updateProduct = useCallback((id: string, data: ProductFormData, currencies: Currency[]) => {
    const existing = stateRef.current.products.find(p => p.id === id);
    if (!existing) return;
    const currency = currencies.find(c => c.id === data.purchaseRateId);
    const product: Product = {
      id,
      name: data.name,
      costUSD: parseFloat(data.costUSD.replace(',', '.')),
      profitPercent: parseFloat(data.profitPercent.replace(',', '.')),
      purchaseRateId: data.purchaseRateId,
      purchaseRate: currency?.rate ?? existing.purchaseRate,
      imageUri: data.imageUri,
      createdAt: existing.createdAt,
    };
    dispatch({ type: 'UPDATE', payload: product });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const value = useMemo(() => ({
    products: state.products,
    loading: state.loading,
    error: state.error,
    addProduct,
    updateProduct,
    deleteProduct,
  }), [state.products, state.loading, state.error, addProduct, updateProduct, deleteProduct]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
}
