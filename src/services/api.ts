import { supabase } from "@/integrations/supabase/client";

// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// ------------------------------------------------------------------
// 1. Custom Error Class (CRITICAL FOR MODALS)
// ------------------------------------------------------------------
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ------------------------------------------------------------------
// Type Definitions
// ------------------------------------------------------------------

// Trades
export type TradeDirection = "LONG" | "SHORT";
export type TradeStatus = "OPEN" | "CLOSED";
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
  entry_time: string;
  exit_time?: string;
  fees?: number;
  stop_loss?: number;
  target?: number;
  pnl?: number;
  notes?: string;
  raw_notes?: string;
  tags?: string[];
  encrypted_screenshots?: string | null;
  metadata?: Record<string, any>;
  strategy_id?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export interface Strategy {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  style?: string;
  instrument_types?: InstrumentType[];
  rules?: Record<string, string[]>;
  track_missed_trades: boolean;
  created_at: string;
  updated_at?: string;
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
  preview: Record<string, any>[];
  message: string;
}

export interface ChatSession {
  id: string;
  topic: string;
  created_at: string;
}

export interface BrokerAccount {
  id: string;
  broker_name: string;
  api_key_last_digits: string;
  last_sync_time?: string;
  is_active: boolean;
  created_at: string;
}

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

// ✅ FIXED: Matches Backend Response
export interface ScreenshotUploadResponse {
  url: string;
  uploaded_to_trade: boolean;
}

export interface TradeScreenshot {
  url: string;
  name?: string;
  uploaded_at?: string;
}

// ------------------------------------------------------------------
// Core Request Wrapper (UPDATED)
// ------------------------------------------------------------------
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) throw new Error("User not authenticated");

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // ✅ Handle Errors Properly
  if (!response.ok) {
    let message = "API Request Failed";
    try {
      const err = await response.json();
      message = err?.detail || message;
    } catch {
      message = `HTTP ${response.status}`;
    }
    // Throw ApiError so UI can check for 402/403
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ------------------------------------------------------------------
// API Modules
// ------------------------------------------------------------------
export const api = {
  // --------------------------------------------------------------
  // Trades
  // --------------------------------------------------------------
  trades: {
    getAll: (page = 1, limit = 20, symbol?: string) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (symbol) params.append("symbol", symbol);

      return request<PaginatedResponse<Trade>>(
        `/trades/?${params.toString()}`
      );
    },

    getOne: (id: string) => request<Trade>(`/trades/${id}`),

    create: (data: Partial<Trade>) =>
      request<Trade>("/trades/", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Trade>) =>
      request<Trade>(`/trades/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<void>(`/trades/${id}`, { method: "DELETE" }),

    // ✅ FIXED: Handle 403 before blob
    export: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const response = await fetch(`${API_BASE_URL}/trades/export`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
            throw new ApiError("Export is a PRO feature. Please upgrade.", 403);
        }
        throw new Error("Failed to export trades");
      }
      
      return response.blob();
    },

    uploadScreenshot: (file: File, tradeId?: string) => {
      const form = new FormData();
      form.append("file", file);
      const q = tradeId ? `?trade_id=${tradeId}` : "";

      return request<ScreenshotUploadResponse>(
        `/trades/uploads/trade-screenshot${q}`,
        {
          method: "POST",
          body: form,
        }
      );
    },

    getScreenshots: (tradeId: string) =>
      request<{ files: TradeScreenshot[] }>(
        `/trades/${tradeId}/screenshots`
      ),
  },

  // --------------------------------------------------------------
  // Strategies
  // --------------------------------------------------------------
  strategies: {
    getAll: () => request<Strategy[]>("/strategies/"),
    getOne: (id: string) => request<Strategy>(`/strategies/${id}`),
    create: (data: Partial<Strategy>) =>
      request<Strategy>("/strategies/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Strategy>) =>
      request<Strategy>(`/strategies/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/strategies/${id}`, { method: "DELETE" }),
  },

  // --------------------------------------------------------------
  // AI / Chat
  // --------------------------------------------------------------
  ai: {
    getSessions: () => request<ChatSession[]>("/chat/sessions"),
    
    deleteSession: (id: string) =>
      request<void>(`/chat/sessions/${id}`, { method: "DELETE" }),

    renameSession: (id: string, topic: string) => 
      request<ChatSession>(`/chat/sessions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ topic }),
      }),

    getHistory: (sessionId: string) =>
      request<ChatMessage[]>(`/chat/${sessionId}/messages`),

    sendMessage: (sessionId: string, message: string, webSearch: boolean = false, model = "gpt-4-turbo") =>
      request<{ 
        response: string; 
        session_id: string;
        usage?: { total_tokens: number };
        tool_call?: {
          type: "import-confirmation" | "trade-confirmation" | "trade-receipt";
          data: any;
        } 
      }>(
        "/chat",
        {
          method: "POST",
          body: JSON.stringify({ 
            session_id: sessionId, 
            message, 
            model,
            web_search: webSearch 
          }),
        }
      ),

    uploadFile: (file: File, sessionId: string, message = "") => {
      const form = new FormData();
      form.append("file", file);
      form.append("session_id", sessionId);
      form.append("message", message);

      return request<UploadResponse>("/chat/upload", {
        method: "POST",
        body: form,
      });
    },

    confirmImport: (filePath: string, mapping: Record<string, string>, sessionId?: string) =>
      request<{ status: string; count: number }>(
        "/chat/import-confirm",
        {
          method: "POST",
          body: JSON.stringify({
            file_path: filePath,
            mapping,
            session_id: sessionId,
          }),
        }
      ),
  },

  // --------------------------------------------------------------
  // Brokers
  // --------------------------------------------------------------
  brokers: {
    getAll: () => request<BrokerAccount[]>("/brokers/"),

    add: (data: any) =>
      request<BrokerAccount>("/brokers/", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<void>(`/brokers/${id}`, { method: "DELETE" }),

    sync: (id: string) =>
      request<{ status: string; message: string }>(
        `/brokers/${id}/sync`,
        { method: "POST" }
      ),

    getDhanAuthUrl: () =>
      request<{ url: string }>("/brokers/dhan/auth-url"),

    connectDhan: (tokenId: string, state: string) =>
      request<{ status: string; broker_id: string }>(
        `/brokers/dhan/connect`,
        {
          method: "POST",
          body: JSON.stringify({ tokenId, state }),
        }
      ),
  },

  // --------------------------------------------------------------
  // News
  // --------------------------------------------------------------
  news: {
    search: (query: string) =>
      request<NewsResult>("/news/search", {
        method: "POST",
        body: JSON.stringify({ query }),
      }),
  },

  // --------------------------------------------------------------
  // Legacy Import
  // --------------------------------------------------------------
  import: {
    uploadCsv: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      form.append("session_id", "legacy-import");
      form.append("message", "Manual CSV Import");

      return request<UploadResponse>("/chat/upload", {
        method: "POST",
        body: form,
      });
    },
  },
};

export default api;