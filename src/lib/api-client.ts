import { supabase } from "@/integrations/supabase/client";

// Ensure this matches your FastAPI backend URL (check port 8000 vs 8080)
const BACKEND_URL = "http://localhost:8000/api/v1";

export interface ChatSession {
  id: string;
  topic: string;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

// --- Core Helper Function (Prevents 'this' context errors) ---
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  // Allow requests even if session is missing (backend will handle 401), 
  // but preferably we check.
  const token = session?.access_token;
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers as Record<string, string>,
  };

  const response = await fetch(`${BACKEND_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    let errorMessage = `API Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMessage = errorData.detail;
    } catch { /* ignore JSON parse error */ }
    throw new Error(errorMessage);
  }
  
  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// --- Main API Client ---
export const apiClient = {
  // Expose the helper for custom calls if needed
  fetch: apiRequest,

  // --- Session Management ---
  getSessions: () => apiRequest<ChatSession[]>("/chat/sessions"),

  getSessionHistory: (sessionId: string) => apiRequest<ChatMessage[]>(`/chat/${sessionId}/messages`),

  deleteSession: (sessionId: string) => apiRequest<void>(`/chat/sessions/${sessionId}`, { method: "DELETE" }),

  // --- Chat & Commands ---
  sendMessage: (message: string, sessionId?: string) => 
    apiRequest<{ response: string; session_id: string; tool_call?: any }>("/chat", {
      method: "POST",
      body: JSON.stringify({ message, session_id: sessionId }),
    }),

  // --- Trades (FastAPI Proxy) ---
  // ✅ This section was missing or undefined in your previous version
  trades: {
    create: (tradeData: any) => 
      apiRequest("/trades/", {
        method: "POST",
        body: JSON.stringify(tradeData),
      }),
      
    // Add other trade methods if needed
    getAll: () => apiRequest("/trades/"),
    delete: (id: string) => apiRequest(`/trades/${id}`, { method: "DELETE" })
  },

  // --- Import (Multipart Upload) ---
  import: {
    confirm: (filePath: string, mapping: any) => 
      apiRequest<{ message: string }>("/chat/import-confirm", {
        method: "POST",
        body: JSON.stringify({ file_path: filePath, mapping })
      })
  }
};