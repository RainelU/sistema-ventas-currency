import { Product, ProductFormData } from '@/types/index';
import { loadData, saveData, STORAGE_KEYS } from '@/utils/storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

// --- State & Actions ---

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

const initialState: ProductsState = {
  products: [],
  loading: true,
  error: null,
};

function productsReducer(
  state: ProductsState,
  action: ProductsAction
): ProductsState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, products: action.payload, loading: false };
    case 'ADD':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE':
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

// --- Context ---

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (data: ProductFormData) => void;
  updateProduct: (id: string, data: ProductFormData) => void;
  deleteProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

// --- Provider ---

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const isFirstRender = useRef(true);

  // Load on mount
  useEffect(() => {
    loadData<Product>(STORAGE_KEYS.PRODUCTS).then((data) => {
      dispatch({ type: 'LOAD', payload: data });
    });
  }, []);

  // Persist on products change (skip initial load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveData(STORAGE_KEYS.PRODUCTS, state.products);
  }, [state.products]);

  function generateId(): string {
    return Date.now().toString() + Math.random().toString(36).slice(2);
  }

  function addProduct(data: ProductFormData) {
    const product: Product = {
      id: generateId(),
      name: data.name,
      costUSD: parseFloat(data.costUSD.replace(',', '.')),
      profitPercent: parseFloat(data.profitPercent.replace(',', '.')),
      purchaseRateId: data.purchaseRateId,
      purchaseRate: parseFloat(data.purchaseRate.replace(',', '.')),
      imageUri: data.imageUri,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD', payload: product });
  }

  function updateProduct(id: string, data: ProductFormData) {
    const existing = state.products.find((p) => p.id === id);
    if (!existing) return;
    const product: Product = {
      id,
      name: data.name,
      costUSD: parseFloat(data.costUSD.replace(',', '.')),
      profitPercent: parseFloat(data.profitPercent.replace(',', '.')),
      purchaseRateId: data.purchaseRateId,
      purchaseRate: parseFloat(data.purchaseRate.replace(',', '.')),
      imageUri: data.imageUri,
      createdAt: existing.createdAt,
    };
    dispatch({ type: 'UPDATE', payload: product });
  }

  function deleteProduct(id: string) {
    dispatch({ type: 'DELETE', payload: id });
  }

  return (
    <ProductsContext.Provider
      value={{
        products: state.products,
        loading: state.loading,
        error: state.error,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

// --- Hook ---

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return ctx;
}
