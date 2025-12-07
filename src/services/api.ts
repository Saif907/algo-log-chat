// src/services/api.ts

import { supabase } from "@/integrations/supabase/client";

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/v1";

// --- Type Definitions (Mirroring Backend Models) ---

export interface Strategy {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  style?: string;
  rules?: any; // Structured rule groups
  created_at: string;
}

export interface Trade {
  id: string;
  symbol: string;
  direction: "LONG" | "SHORT";
  status: "OPEN" | "CLOSED" | "CANCELED";
  entry_price: number;
  exit_price?: number;
  quantity: number;
  entry_time: string;
  exit_time?: string;
  raw_notes?: string;
  tags?: string[];
  pnl?: number; // Calculated field if available
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

// --- Core Request Wrapper ---

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "API Request Failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
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
    getAll: () => request<Trade[]>("/trades/trades"),
    
    getOne: (id: string) => request<Trade>(`/trades/trades/${id}`),
    
    create: (tradeData: Partial<Trade>) => 
      request<Trade>("/trades/trades", {
        method: "POST",
        body: JSON.stringify(tradeData),
      }),
      
    update: (id: string, updates: Partial<Trade>) =>
      request<Trade>(`/trades/trades/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
      
    delete: (id: string) =>
      request<void>(`/trades/trades/${id}`, {
        method: "DELETE",
      }),
  },

  // 2. Strategies
  strategies: {
    getAll: () => request<Strategy[]>("/trades/strategies"),
    
    create: (strategyData: Partial<Strategy>) =>
      request<Strategy>("/trades/strategies", {
        method: "POST",
        body: JSON.stringify(strategyData),
      }),
      
    update: (id: string, updates: Partial<Strategy>) =>
      request<Strategy>(`/trades/strategies/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
      
    delete: (id: string) =>
      request<void>(`/trades/strategies/${id}`, {
        method: "DELETE",
      }),
  },

  // 3. AI & Chat
  ai: {
    startSession: (topic?: string) =>
      request<{ id: string; topic: string }>("/ai/chat/start", {
        method: "POST",
        body: JSON.stringify({ topic }),
      }),

    sendMessage: (sessionId: string, message: string) =>
      request<ChatMessage>("/ai/chat/message", {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId, raw_message: message }),
      }),

    getHistory: (sessionId: string) =>
      request<ChatMessage[]>(`/ai/chat/${sessionId}/history`),
  },
  
  // 4. Data Import
  import: {
    uploadCsv: (file: File) => {
      const formData = new FormData();
      formData.append("csv_file", file);
      
      // Note: We need to bypass the default JSON Content-Type header for FormData
      // The browser sets the correct multipart boundary automatically
      return supabase.auth.getSession().then(({ data: { session } }) => {
        return fetch(`${API_BASE_URL}/data/import/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session?.access_token}`,
          },
          body: formData,
        }).then(res => {
          if (!res.ok) throw new Error("Upload failed");
          return res.json();
        });
      });
    }
  }
};