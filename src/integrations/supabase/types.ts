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
      admin_notifications: {
        Row: {
          admin_id: string
          company_id: string
          created_at: string
          id: string
          message: string
          read: boolean
        }
        Insert: {
          admin_id: string
          company_id: string
          created_at?: string
          id?: string
          message: string
          read?: boolean
        }
        Update: {
          admin_id?: string
          company_id?: string
          created_at?: string
          id?: string
          message?: string
          read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          company_name: string
          country: string
          created_at: string
          date_of_incorporation: string | null
          description: string | null
          email: string
          id: string
          phone_number: string | null
          plan_type: string | null
          privacy_url: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["company_status"]
          terms_url: string | null
          tracking_id: string | null
          updated_at: string
          user_id: string
          views_count: number | null
          website_url: string
        }
        Insert: {
          company_name: string
          country: string
          created_at?: string
          date_of_incorporation?: string | null
          description?: string | null
          email: string
          id?: string
          phone_number?: string | null
          plan_type?: string | null
          privacy_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          terms_url?: string | null
          tracking_id?: string | null
          updated_at?: string
          user_id: string
          views_count?: number | null
          website_url: string
        }
        Update: {
          company_name?: string
          country?: string
          created_at?: string
          date_of_incorporation?: string | null
          description?: string | null
          email?: string
          id?: string
          phone_number?: string | null
          plan_type?: string | null
          privacy_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          terms_url?: string | null
          tracking_id?: string | null
          updated_at?: string
          user_id?: string
          views_count?: number | null
          website_url?: string
        }
        Relationships: []
      }
      company_branding: {
        Row: {
          company_id: string
          cover_url: string | null
          created_at: string
          display_text: string | null
          id: string
          logo_url: string | null
          primary_color: string
          updated_at: string
        }
        Insert: {
          company_id: string
          cover_url?: string | null
          created_at?: string
          display_text?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          cover_url?: string | null
          created_at?: string
          display_text?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_branding_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_documents: {
        Row: {
          company_id: string
          created_at: string
          file_name: string
          file_type: string
          file_url: string
          id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          file_name: string
          file_type: string
          file_url: string
          id?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_subscriptions: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          ends_at: string | null
          id: string
          plan_id: string
          started_at: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          ends_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean
          created_at: string
          features: Json | null
          id: string
          name: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          price_eur: number
          view_limit: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          features?: Json | null
          id?: string
          name: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          price_eur: number
          view_limit: number
        }
        Update: {
          active?: boolean
          created_at?: string
          features?: Json | null
          id?: string
          name?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          price_eur?: number
          view_limit?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          browser: string | null
          company_id: string
          country: string | null
          created_at: string
          device_type: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          company_id: string
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          company_id?: string
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      company_status: "pending" | "under_review" | "approved" | "rejected"
      plan_type: "starter" | "growth" | "pro" | "business" | "enterprise"
      user_role: "admin" | "company"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      company_status: ["pending", "under_review", "approved", "rejected"],
      plan_type: ["starter", "growth", "pro", "business", "enterprise"],
      user_role: ["admin", "company"],
    },
  },
} as const
