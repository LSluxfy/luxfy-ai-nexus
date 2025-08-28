export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          about_company: string
          active: boolean
          appointments_blocked: string[] | null
          appointments_default_duration: number
          appointments_end_time: string
          appointments_rules: string
          appointments_start_time: string
          apprenticeship: string
          create_at: string
          crm_id: number | null
          delay_response: number
          description: string
          eleven_labs_api_key: string | null
          faq: string
          flow: string
          host_email: string | null
          id: number
          initialized_at: string | null
          language: string
          metrics: string
          model: string
          model_api_key: string | null
          name: string
          oficial_meta_whatsapp_access_token: string | null
          oficial_meta_whatsapp_phone_number: string | null
          pass_email: string | null
          port_email: string | null
          products_services: string
          secure_email: boolean | null
          select_voice_id: string | null
          style_response: Database["public"]["Enums"]["ResponseAgentStyle"]
          tags: string[] | null
          transfer_in_distrust: boolean
          update_at: string
          user_email: string | null
          user_id: number
        }
        Insert: {
          about_company?: string
          active?: boolean
          appointments_blocked?: string[] | null
          appointments_default_duration?: number
          appointments_end_time?: string
          appointments_rules?: string
          appointments_start_time?: string
          apprenticeship?: string
          create_at?: string
          crm_id?: number | null
          delay_response?: number
          description?: string
          eleven_labs_api_key?: string | null
          faq?: string
          flow?: string
          host_email?: string | null
          id?: number
          initialized_at?: string | null
          language?: string
          metrics?: string
          model?: string
          model_api_key?: string | null
          name: string
          oficial_meta_whatsapp_access_token?: string | null
          oficial_meta_whatsapp_phone_number?: string | null
          pass_email?: string | null
          port_email?: string | null
          products_services?: string
          secure_email?: boolean | null
          select_voice_id?: string | null
          style_response?: Database["public"]["Enums"]["ResponseAgentStyle"]
          tags?: string[] | null
          transfer_in_distrust?: boolean
          update_at: string
          user_email?: string | null
          user_id: number
        }
        Update: {
          about_company?: string
          active?: boolean
          appointments_blocked?: string[] | null
          appointments_default_duration?: number
          appointments_end_time?: string
          appointments_rules?: string
          appointments_start_time?: string
          apprenticeship?: string
          create_at?: string
          crm_id?: number | null
          delay_response?: number
          description?: string
          eleven_labs_api_key?: string | null
          faq?: string
          flow?: string
          host_email?: string | null
          id?: number
          initialized_at?: string | null
          language?: string
          metrics?: string
          model?: string
          model_api_key?: string | null
          name?: string
          oficial_meta_whatsapp_access_token?: string | null
          oficial_meta_whatsapp_phone_number?: string | null
          pass_email?: string | null
          port_email?: string | null
          products_services?: string
          secure_email?: boolean | null
          select_voice_id?: string | null
          style_response?: Database["public"]["Enums"]["ResponseAgentStyle"]
          tags?: string[] | null
          transfer_in_distrust?: boolean
          update_at?: string
          user_email?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "agents_crm_id_fkey"
            columns: ["crm_id"]
            isOneToOne: false
            referencedRelation: "crm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          agent_id: number
          client_name: string
          create_at: string
          date_time: string
          duration: number
          id: number
          local: string
          observations: string | null
          title: string
          type: string
          update_at: string
        }
        Insert: {
          agent_id: number
          client_name: string
          create_at?: string
          date_time: string
          duration: number
          id?: number
          local: string
          observations?: string | null
          title: string
          type: string
          update_at: string
        }
        Update: {
          agent_id?: number
          client_name?: string
          create_at?: string
          date_time?: string
          duration?: number
          id?: number
          local?: string
          observations?: string | null
          title?: string
          type?: string
          update_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      campaings: {
        Row: {
          active: boolean
          agent_id: number
          attachments: string[] | null
          body: string | null
          create_at: string
          dispatches_per: Database["public"]["Enums"]["DispatchesPer"]
          end_date: string | null
          id: number
          last_sent_at: string | null
          message: string | null
          name: string
          send_by: Database["public"]["Enums"]["CampaingSendBy"]
          start_date: string
          subject: string | null
          tags: string[] | null
          update_at: string
        }
        Insert: {
          active?: boolean
          agent_id: number
          attachments?: string[] | null
          body?: string | null
          create_at?: string
          dispatches_per?: Database["public"]["Enums"]["DispatchesPer"]
          end_date?: string | null
          id?: number
          last_sent_at?: string | null
          message?: string | null
          name: string
          send_by?: Database["public"]["Enums"]["CampaingSendBy"]
          start_date: string
          subject?: string | null
          tags?: string[] | null
          update_at: string
        }
        Update: {
          active?: boolean
          agent_id?: number
          attachments?: string[] | null
          body?: string | null
          create_at?: string
          dispatches_per?: Database["public"]["Enums"]["DispatchesPer"]
          end_date?: string | null
          id?: number
          last_sent_at?: string | null
          message?: string | null
          name?: string
          send_by?: Database["public"]["Enums"]["CampaingSendBy"]
          start_date?: string
          subject?: string | null
          tags?: string[] | null
          update_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          agent_id: number
          collection_data: string
          create_at: string
          ia_response: boolean
          id: number
          messages: string
          messages_count: number
          number: string
          tags: string[] | null
          update_at: string
        }
        Insert: {
          agent_id: number
          collection_data?: string
          create_at?: string
          ia_response?: boolean
          id?: number
          messages?: string
          messages_count?: number
          number: string
          tags?: string[] | null
          update_at: string
        }
        Update: {
          agent_id?: number
          collection_data?: string
          create_at?: string
          ia_response?: boolean
          id?: number
          messages?: string
          messages_count?: number
          number?: string
          tags?: string[] | null
          update_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      crm: {
        Row: {
          create_at: string
          id: number
          rows: string
          tables: string
          update_at: string
        }
        Insert: {
          create_at?: string
          id?: number
          rows?: string
          tables?: string
          update_at: string
        }
        Update: {
          create_at?: string
          id?: number
          rows?: string
          tables?: string
          update_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          action: string
          amount: number
          create_at: string
          description: string
          due_date: string | null
          external_ref: string | null
          id: number
          paid_value: number | null
          paid_with: string | null
          payment_date: string | null
          plan: Database["public"]["Enums"]["Plans"]
          public_id: string
          status: Database["public"]["Enums"]["InvoiceStatus"]
          update_at: string
          user_id: number
        }
        Insert: {
          action: string
          amount: number
          create_at?: string
          description: string
          due_date?: string | null
          external_ref?: string | null
          id?: number
          paid_value?: number | null
          paid_with?: string | null
          payment_date?: string | null
          plan: Database["public"]["Enums"]["Plans"]
          public_id: string
          status?: Database["public"]["Enums"]["InvoiceStatus"]
          update_at: string
          user_id: number
        }
        Update: {
          action?: string
          amount?: number
          create_at?: string
          description?: string
          due_date?: string | null
          external_ref?: string | null
          id?: number
          paid_value?: number | null
          paid_with?: string | null
          payment_date?: string | null
          plan?: Database["public"]["Enums"]["Plans"]
          public_id?: string
          status?: Database["public"]["Enums"]["InvoiceStatus"]
          update_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_users: {
        Row: {
          email: string
          id: number
          plan: Database["public"]["Enums"]["Plans"]
        }
        Insert: {
          email: string
          id?: number
          plan: Database["public"]["Enums"]["Plans"]
        }
        Update: {
          email?: string
          id?: number
          plan?: Database["public"]["Enums"]["Plans"]
        }
        Relationships: []
      }
      uploads: {
        Row: {
          create_at: string
          expire_at: string
          file_name: string
          file_url: string
          id: number
          identification: string | null
          update_at: string
        }
        Insert: {
          create_at?: string
          expire_at: string
          file_name: string
          file_url: string
          id?: number
          identification?: string | null
          update_at: string
        }
        Update: {
          create_at?: string
          expire_at?: string
          file_name?: string
          file_url?: string
          id?: number
          identification?: string | null
          update_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          active: boolean
          auth_token: string | null
          create_at: string
          email: string
          id: number
          is_admin: boolean
          last_login: string | null
          last_name: string
          login_method: Database["public"]["Enums"]["LoginMethods"]
          migrate: boolean
          name: string
          number_agentes: number
          password: string
          plan: Database["public"]["Enums"]["Plans"]
          profile_expire: string | null
          reedem_expire: string | null
          reedem_token: string | null
          update_at: string
          user_name: string
          verification_code: string
        }
        Insert: {
          active?: boolean
          auth_token?: string | null
          create_at?: string
          email: string
          id?: number
          is_admin?: boolean
          last_login?: string | null
          last_name: string
          login_method: Database["public"]["Enums"]["LoginMethods"]
          migrate?: boolean
          name: string
          number_agentes?: number
          password: string
          plan: Database["public"]["Enums"]["Plans"]
          profile_expire?: string | null
          reedem_expire?: string | null
          reedem_token?: string | null
          update_at: string
          user_name: string
          verification_code: string
        }
        Update: {
          active?: boolean
          auth_token?: string | null
          create_at?: string
          email?: string
          id?: number
          is_admin?: boolean
          last_login?: string | null
          last_name?: string
          login_method?: Database["public"]["Enums"]["LoginMethods"]
          migrate?: boolean
          name?: string
          number_agentes?: number
          password?: string
          plan?: Database["public"]["Enums"]["Plans"]
          profile_expire?: string | null
          reedem_expire?: string | null
          reedem_token?: string | null
          update_at?: string
          user_name?: string
          verification_code?: string
        }
        Relationships: []
      }
      voices: {
        Row: {
          agent_id: number
          create_at: string
          id: number
          update_at: string
          voice_id: string
          voice_name: string
        }
        Insert: {
          agent_id: number
          create_at?: string
          id?: number
          update_at: string
          voice_id: string
          voice_name: string
        }
        Update: {
          agent_id?: number
          create_at?: string
          id?: number
          update_at?: string
          voice_id?: string
          voice_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "voices_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_invoice_details: {
        Args: { invoice_id: number }
        Returns: {
          action: string
          amount: number
          created_at: string
          description: string
          due_date: string
          id: number
          public_id: string
          status: string
          user_active: boolean
          user_email: string
          user_id: number
          user_name: string
        }[]
      }
      get_invoice_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          affected_users: number
          average_amount: number
          low_value_invoices: number
          total_pending_amount: number
          total_pending_invoices: number
        }[]
      }
      get_pending_invoices_with_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          action: string
          amount: number
          created_at: string
          description: string
          due_date: string
          id: number
          public_id: string
          status: string
          user_active: boolean
          user_email: string
          user_id: number
          user_name: string
        }[]
      }
    }
    Enums: {
      CampaingSendBy:
        | "PREFER_EMAIL"
        | "PREFER_WHATSAPP"
        | "ONLY_EMAIL"
        | "ONLY_WHATSAPP"
        | "EMAIL_AND_WHATSAPP"
      DispatchesPer: "HOUR" | "DAY" | "WEEK" | "MONTH"
      InvoiceStatus: "PENDING" | "PAID" | "CANCELED"
      LoginMethods: "EMAIL" | "GOOGLE"
      Plans: "BASICO" | "PRO" | "PREMIUM"
      ResponseAgentStyle: "CONCISE" | "BALANCED" | "DETAILED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      CampaingSendBy: [
        "PREFER_EMAIL",
        "PREFER_WHATSAPP",
        "ONLY_EMAIL",
        "ONLY_WHATSAPP",
        "EMAIL_AND_WHATSAPP",
      ],
      DispatchesPer: ["HOUR", "DAY", "WEEK", "MONTH"],
      InvoiceStatus: ["PENDING", "PAID", "CANCELED"],
      LoginMethods: ["EMAIL", "GOOGLE"],
      Plans: ["BASICO", "PRO", "PREMIUM"],
      ResponseAgentStyle: ["CONCISE", "BALANCED", "DETAILED"],
    },
  },
} as const
