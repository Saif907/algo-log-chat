import { supabase } from "@/integrations/supabase/client";

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// --- Type Definitions ---

// 1. Trades
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
  
  // Content
  notes?: string;      // This maps to 'encrypted_notes' from backend (but is plain text now)
  raw_notes?: string;  
  tags?: string[];
  
  // Metadata & Strategy
  metadata?: Record<string, any>; 
  strategy_id?: string;
  created_at: string;
}

// 2. Pagination Wrapper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

// 3. Strategies
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

// 4. Chat / AI
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
  preview: Record<string, any>[]; // ✅ Grid Data
  message: string;
}

// 5. Brokers
export interface BrokerAccount {
  id: string;
  broker_name: string;
  api_key_last_digits: string; 
  last_sync_time?: string;
  is_active: boolean;
  created_at: string;
}

// 6. News / Research
export interface NewsSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface NewsResult {
  answer: string;
  sources: NewsSource[];
  related_questions: string[];
}

// --- Core Request Wrapper ---

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

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
      if (response.status === 422 && errorData.detail) {
        // Handle Pydantic Validation Errors gracefully
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

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// --- API Modules ---

export const api = {
  // 1. Trades Module
  trades: {
    getAll: (page = 1, limit = 20, symbol?: string) => {
      const params = new URLSearchParams({ 
          page: page.toString(), 
          limit: limit.toString() 
      });
      if (symbol) params.append("symbol", symbol);
      return request<PaginatedResponse<Trade>>(`/trades/?${params.toString()}`);
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

  // 2. Strategies Module
  strategies: {
    getAll: () => request<Strategy[]>("/strategies/"),
    create: (data: Partial<Strategy>) => request<Strategy>("/strategies/", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Strategy>) => request<Strategy>(`/strategies/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/strategies/${id}`, { method: "DELETE" }),
  },

  // 3. AI & Chat Module
  ai: {
    getSessions: () => request<{id: string, topic: string}[]>("/chat/sessions"),
    deleteSession: (id: string) => request<void>(`/chat/sessions/${id}`, { method: "DELETE" }),
    getHistory: (sessionId: string) => request<ChatMessage[]>(`/chat/${sessionId}/messages`),
    
    sendMessage: (sessionId: string, message: string, model = "gpt-4-turbo") =>
      request<{ response: string; session_id: string; tool_call?: any }>("/chat", {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId, message, model }),
      }),
      
    uploadFile: (file: File, sessionId: string, message = "") => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", sessionId);
      formData.append("message", message);
      return request<UploadResponse>("/chat/upload", { method: "POST", body: formData });
    },
    
    confirmImport: (filePath: string, mapping: Record<string, string>, sessionId?: string) =>
      request<{ status: string; count: number }>("/chat/import-confirm", {
        method: "POST",
        body: JSON.stringify({ file_path: filePath, mapping, session_id: sessionId }),
      })
  },

  // 4. Brokers Module
  brokers: {
    getAll: () => request<BrokerAccount[]>("/brokers/"),
    add: (data: any) => request<BrokerAccount>("/brokers/", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/brokers/${id}`, { method: "DELETE" }),
    sync: (id: string) => request<{ status: string; message: string }>(`/brokers/${id}/sync`, { method: "POST" }),
  },

  // 5. News / Perplexity Module
  news: {
    search: (query: string) => 
      request<NewsResult>("/news/search", {
        method: "POST",
        body: JSON.stringify({ query })
      })
  },

  // 6. Legacy Import (Optional wrapper)
  import: {
    uploadCsv: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", "legacy-import"); 
      formData.append("message", "Manual CSV Import");
      return request<UploadResponse>("/chat/upload", { method: "POST", body: formData });
    }
  }
};