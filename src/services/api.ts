// src/services/api.ts

import { supabase } from "@/integrations/supabase/client";

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// --- Type Definitions ---

export type TradeDirection = "Long" | "Short";
export type TradeStatus = "OPEN" | "CLOSED" | "PENDING" | "CANCELED";
export type InstrumentType = "STOCK" | "CRYPTO" | "FOREX" | "FUTURES";

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  instrument_type: InstrumentType;
  direction: TradeDirection;
  status: TradeStatus;
  entry_price: number;
  exit_price?: number;
  quantity: number;
  entry_time: string; // ISO String
  exit_time?: string; // ISO String
  fees?: number;
  stop_loss?: number;
  target?: number;
  pnl?: number; 
  notes?: string;      // Main notes field
  raw_notes?: string;  // Alias for backward compatibility
  tags?: string[];     // Tags for filtering
  metadata?: Record<string, any>; // Flexible JSON for extra data (Emotion, Setup, etc.)
  strategy_id?: string;
  created_at: string;
}

export interface Strategy {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  style?: string;
  instrument_types?: InstrumentType[];
  rules?: Record<string, string[]>; 
  created_at: string;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

export interface UploadResponse {
  type: string;
  file_path: string;
  filename: string;
  mapping: Record<string, string>;
  detected_headers: string[];
  message: string;
}

export interface BrokerAccount {
  id: string;
  broker_name: string;
  api_key_last_digits: string; 
  last_sync_time?: string;
  is_active: boolean;
  created_at: string;
}

// --- Core Request Wrapper (Robust Version) ---

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  // 1. Determine Headers
  const isFormData = options.body instanceof FormData;
  
  const headers: HeadersInit = {
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  // 2. ONLY set JSON content type if it's NOT FormData
  // (Browser automatically sets multipart/form-data with boundary for FormData)
  if (!isFormData) {
    Object.assign(headers, { "Content-Type": "application/json" });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "API Request Failed";
    try {
      const errorData = await response.json();
      // Handle FastAPI Validation Errors (422) specifically
      if (response.status === 422 && errorData.detail) {
        const detail = Array.isArray(errorData.detail) 
          ? errorData.detail.map((e: any) => `${e.loc.join('.')} ${e.msg}`).join(', ')
          : errorData.detail;
        errorMessage = `Validation Error: ${detail}`;
      } else {
        errorMessage = errorData.detail || errorMessage;
      }
    } catch (e) {
      errorMessage = `HTTP Error ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// --- API Modules ---

export const api = {
  // 1. Trades
  trades: {
    getAll: (skip = 0, limit = 50, symbol?: string) => {
      const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
      if (symbol) params.append("symbol", symbol);
      return request<Trade[]>(`/trades/?${params.toString()}`);
    },
    
    getOne: (id: string) => request<Trade>(`/trades/${id}`),
    
    create: (tradeData: Partial<Trade>) => 
      request<Trade>("/trades/", {
        method: "POST",
        body: JSON.stringify(tradeData),
      }),

    update: (id: string, updates: Partial<Trade>) =>
      request<Trade>(`/trades/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
      
    delete: (id: string) =>
      request<void>(`/trades/${id}`, {
        method: "DELETE",
      }),
  },

  // 2. Strategies
  strategies: {
    getAll: () => request<Strategy[]>("/strategies/"),
    
    create: (strategyData: Partial<Strategy>) =>
      request<Strategy>("/strategies/", {
        method: "POST",
        body: JSON.stringify(strategyData),
      }),
      
    update: (id: string, updates: Partial<Strategy>) =>
      request<Strategy>(`/strategies/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
      
    delete: (id: string) =>
      request<void>(`/strategies/${id}`, {
        method: "DELETE",
      }),
  },

  // 3. AI & Chat
  ai: {
    getSessions: () => request<{id: string, topic: string}[]>("/chat/sessions"),

    deleteSession: (id: string) => 
      request<void>(`/chat/sessions/${id}`, { method: "DELETE" }),

    getHistory: (sessionId: string) =>
      request<ChatMessage[]>(`/chat/${sessionId}/messages`),

    sendMessage: (sessionId: string, message: string, model = "gpt-4-turbo") =>
      request<{ response: string; session_id: string; tool_call?: any }>("/chat", {
        method: "POST",
        body: JSON.stringify({ 
            session_id: sessionId, 
            message: message,
            model: model 
        }),
      }),
      
    uploadFile: (file: File, sessionId: string, message = "") => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", sessionId);
      formData.append("message", message);
      
      return request<UploadResponse>("/chat/upload", {
        method: "POST",
        body: formData,
      });
    },

    confirmImport: (filePath: string, mapping: Record<string, string>, sessionId?: string) =>
      request<{ status: string; count: number }>("/chat/import-confirm", {
        method: "POST",
        body: JSON.stringify({ 
            file_path: filePath, 
            mapping, 
            session_id: sessionId 
        }),
      })
  },

  // 4. Brokers
  brokers: {
    getAll: () => request<BrokerAccount[]>("/brokers/"),
    
    add: (data: { broker_name: string; api_key: string; api_secret: string }) =>
      request<BrokerAccount>("/brokers/", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<void>(`/brokers/${id}`, { method: "DELETE" }),

    sync: (id: string) =>
      request<{ status: string; message: string }>(`/brokers/${id}/sync`, { method: "POST" }),
  },

  // 5. Data Import (Legacy Support Wrapper)
  import: {
    uploadCsv: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", "legacy-import"); 
      formData.append("message", "Manual CSV Import");
      return request<UploadResponse>("/chat/upload", {
        method: "POST",
        body: formData,
      });
    }
  }
};