// src/contexts/CurrencyContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyContextType {
  currency: string;
  symbol: string;
  rate: number;
  isLoading: boolean;
  convert: (amount: number) => number;
  format: (amount: number) => string;
  refreshCurrency: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Map of currency codes to symbols
const SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", JPY: "¥", AUD: "A$", INR: "₹", 
  CAD: "C$", CHF: "Fr", CNY: "¥"
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState("USD");
  const [rate, setRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch User's Preferred Currency from Supabase
  const fetchUserPreference = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      const prefs = data?.preferences as any;
      if (prefs?.default_currency) {
        setCurrency(prefs.default_currency);
      }
    } catch (error) {
      console.error("Failed to load currency preference", error);
    }
  };

  // 2. Fetch Live Exchange Rate (Base USD)
  const fetchExchangeRate = async () => {
    if (currency === "USD") {
      setRate(1);
      setIsLoading(false);
      return;
    }

    try {
      // Free API: Frankfurter (Open Source, No Key needed)
      const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${currency}`);
      const data = await res.json();
      if (data.rates && data.rates[currency]) {
        setRate(data.rates[currency]);
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate", error);
      // Fallback to 1 if API fails to prevent UI crash
      setRate(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchUserPreference();
  }, [user]);

  // Update Rate when Currency Changes
  useEffect(() => {
    fetchExchangeRate();
  }, [currency]);

  // Helper: Convert raw USD value to selected currency
  const convert = (amount: number) => {
    return amount * rate;
  };

  // Helper: Format with symbol and decimals
  const format = (amount: number) => {
    const converted = convert(amount);
    return `${SYMBOLS[currency] || currency} ${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      symbol: SYMBOLS[currency] || "$", 
      rate, 
      isLoading, 
      convert, 
      format,
      refreshCurrency: fetchUserPreference
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};