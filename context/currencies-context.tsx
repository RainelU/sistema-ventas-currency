import { Currency, CurrencyFormData } from '@/types/index';
import { loadData, saveData, STORAGE_KEYS } from '@/utils/storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';

// --- State & Actions ---

interface CurrenciesState {
  currencies: Currency[];
  loading: boolean;
  error: string | null;
}

type CurrenciesAction =
  | { type: 'LOAD'; payload: Currency[] }
  | { type: 'ADD'; payload: Currency }
  | { type: 'UPDATE'; payload: Currency }
  | { type: 'DELETE'; payload: string };

const initialState: CurrenciesState = {
  currencies: [],
  loading: true,
  error: null,
};

function currenciesReducer(
  state: CurrenciesState,
  action: CurrenciesAction
): CurrenciesState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, currencies: action.payload, loading: false };
    case 'ADD':
      return { ...state, currencies: [...state.currencies, action.payload] };
    case 'UPDATE':
      return {
        ...state,
        currencies: state.currencies.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE':
      return {
        ...state,
        currencies: state.currencies.filter((c) => c.id !== action.payload),
      };
    default:
      return state;
  }
}

// --- Context ---

interface CurrenciesContextValue {
  currencies: Currency[];
  loading: boolean;
  error: string | null;
  referenceCurrency: Currency | null;
  addCurrency: (data: CurrencyFormData) => void;
  updateCurrency: (id: string, data: CurrencyFormData) => void;
  deleteCurrency: (id: string) => void;
}

const CurrenciesContext = createContext<CurrenciesContextValue | null>(null);

// --- Provider ---

export function CurrenciesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(currenciesReducer, initialState);

  useEffect(() => {
    loadData<Currency>(STORAGE_KEYS.CURRENCIES).then((data) => {
      dispatch({ type: 'LOAD', payload: data });
    });
  }, []);

  useEffect(() => {
    // Only persist after initial load is complete (loading === false)
    if (state.loading) return;
    saveData(STORAGE_KEYS.CURRENCIES, state.currencies);
  }, [state.currencies, state.loading]);

  const referenceCurrency: Currency | null =
    state.currencies.length === 0
      ? null
      : state.currencies.reduce((prev, curr) =>
          curr.rate > prev.rate ? curr : prev
        );

  function generateId(): string {
    return Date.now().toString() + Math.random().toString(36).slice(2);
  }

  const addCurrency = useCallback((data: CurrencyFormData) => {
    const currency: Currency = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: data.name,
      rate: parseFloat(data.rate.replace(',', '.')),
    };
    dispatch({ type: 'ADD', payload: currency });
  }, []);

  const updateCurrency = useCallback((id: string, data: CurrencyFormData) => {
    const currency: Currency = {
      id,
      name: data.name,
      rate: parseFloat(data.rate.replace(',', '.')),
    };
    dispatch({ type: 'UPDATE', payload: currency });
  }, []);

  const deleteCurrency = useCallback((id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const value = useMemo(() => ({
    currencies: state.currencies,
    loading: state.loading,
    error: state.error,
    referenceCurrency,
    addCurrency,
    updateCurrency,
    deleteCurrency,
  }), [state.currencies, state.loading, state.error, referenceCurrency, addCurrency, updateCurrency, deleteCurrency]);

  return (
    <CurrenciesContext.Provider value={value}>
      {children}
    </CurrenciesContext.Provider>
  );
}

// --- Hook ---

export function useCurrencies(): CurrenciesContextValue {
  const ctx = useContext(CurrenciesContext);
  if (!ctx) {
    throw new Error('useCurrencies must be used within a CurrenciesProvider');
  }
  return ctx;
}
