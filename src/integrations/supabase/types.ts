export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auth_users: { // Represents the auth.users table linked in the diagram
        Row: {
          id: string
          // Add other auth fields if needed, though usually accessed via supabase.auth
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
      }
      user_profiles: {
        Row: {
          id: string // linked to auth.users.id
          active_plan_id: string | null
          ai_chat_quota_used: number | null
          region_code: string | null
          default_currency: string | null
          preferences: Json | null
          consent_ai_training: boolean | null
          gateway_customer_id: string | null
          current_period_end: string | null // timestamptz
          created_at: string | null // timestamptz
          updated_at: string | null // timestamptz
        }
        Insert: {
          id: string
          active_plan_id?: string | null
          ai_chat_quota_used?: number | null
          region_code?: string | null
          default_currency?: string | null
          preferences?: Json | null
          consent_ai_training?: boolean | null
          gateway_customer_id?: string | null
          current_period_end?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          active_plan_id?: string | null
          ai_chat_quota_used?: number | null
          region_code?: string | null
          default_currency?: string | null
          preferences?: Json | null
          consent_ai_training?: boolean | null
          gateway_customer_id?: string | null
          current_period_end?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      strategies: {
        Row: {
          id: string // uuid
          user_id: string // uuid
          name: string | null
          emoji: string | null
          description: string | null
          rules: Json | null // jsonb
          color_hex: string | null
          style: string | null
          instrument_types: string[] | null // _text (text array)
          track_missed_trades: boolean | null
          created_at: string | null // timestamptz
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          emoji?: string | null
          description?: string | null
          rules?: Json | null
          color_hex?: string | null
          style?: string | null
          instrument_types?: string[] | null
          track_missed_trades?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          emoji?: string | null
          description?: string | null
          rules?: Json | null
          color_hex?: string | null
          style?: string | null
          instrument_types?: string[] | null
          track_missed_trades?: boolean | null
          created_at?: string | null
        }
      }
      trades: {
        Row: {
          id: string // uuid
          user_id: string // uuid
          symbol: string | null
          direction: string | null // trading_direction enum (likely)
          status: string | null // trade_status enum (likely)
          entry_price: number | null // numeric
          exit_price: number | null // numeric
          quantity: number | null // int4
          fees: number | null // numeric
          entry_time: string | null // timestamptz
          exit_time: string | null // timestamptz
          encrypted_notes: string | null // text
          encrypted_screenshots: string[] | null // _text (text array)
          tags: string[] | null // _text (text array)
          strategy_id: string | null // uuid
          source_type: string | null // text
          broker_account_id: string | null // uuid
          import_batch_id: string | null // uuid
          created_at: string | null // timestamptz
        }
        Insert: {
          id?: string
          user_id: string
          symbol?: string | null
          direction?: string | null
          status?: string | null
          entry_price?: number | null
          exit_price?: number | null
          quantity?: number | null
          fees?: number | null
          entry_time?: string | null
          exit_time?: string | null
          encrypted_notes?: string | null
          encrypted_screenshots?: string[] | null
          tags?: string[] | null
          strategy_id?: string | null
          source_type?: string | null
          broker_account_id?: string | null
          import_batch_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string | null
          direction?: string | null
          status?: string | null
          entry_price?: number | null
          exit_price?: number | null
          quantity?: number | null
          fees?: number | null
          entry_time?: string | null
          exit_time?: string | null
          encrypted_notes?: string | null
          encrypted_screenshots?: string[] | null
          tags?: string[] | null
          strategy_id?: string | null
          source_type?: string | null
          broker_account_id?: string | null
          import_batch_id?: string | null
          created_at?: string | null
        }
      }
      chat_sessions: {
        Row: {
          id: string // uuid
          user_id: string // uuid
          topic: string | null
          is_active: boolean | null
          created_at: string | null // timestamptz
        }
        Insert: {
          id?: string
          user_id: string
          topic?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          topic?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: number // int8
          session_id: string // uuid
          user_id: string // uuid
          role: string | null
          encrypted_content: string | null
          model_name: string | null
          usage_tokens: number | null // int4
          created_at: string | null // timestamptz
        }
        Insert: {
          id?: number
          session_id: string
          user_id: string
          role?: string | null
          encrypted_content?: string | null
          model_name?: string | null
          usage_tokens?: number | null
          created_at?: string | null
        }
        Update: {
          id?: number
          session_id?: string
          user_id?: string
          role?: string | null
          encrypted_content?: string | null
          model_name?: string | null
          usage_tokens?: number | null
          created_at?: string | null
        }
      }
      broker_accounts: {
        Row: {
          id: string // uuid
          user_id: string // uuid
          broker_name: string | null
          encrypted_credentials: string | null
          api_key_last_digits: string | null
          last_sync_time: string | null // timestamptz
          is_active: boolean | null
          created_at: string | null // timestamptz
        }
        Insert: {
          id?: string
          user_id: string
          broker_name?: string | null
          encrypted_credentials?: string | null
          api_key_last_digits?: string | null
          last_sync_time?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          broker_name?: string | null
          encrypted_credentials?: string | null
          api_key_last_digits?: string | null
          last_sync_time?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      import_jobs: {
        Row: {
          id: string // uuid
          user_id: string // uuid
          job_type: string | null
          status: string | null // import_status enum (likely)
          file_path: string | null
          total_records: number | null // int4
          processed_records: number | null // int4
          error_message: string | null
          created_at: string | null // timestamptz
          updated_at: string | null // timestamptz
        }
        Insert: {
          id?: string
          user_id: string
          job_type?: string | null
          status?: string | null
          file_path?: string | null
          total_records?: number | null
          processed_records?: number | null
          error_message?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          job_type?: string | null
          status?: string | null
          file_path?: string | null
          total_records?: number | null
          processed_records?: number | null
          error_message?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      trading_direction: "LONG" | "SHORT" // Assuming these values based on naming convention
      trade_status: "OPEN" | "CLOSED" // Assuming these values
      import_status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" // Example statuses
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}