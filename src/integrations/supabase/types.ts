export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      agentes: {
        Row: {
          agenda: string
          ai_personality: string
          ai_usage: string
          apprenticeship: string
          companeyTel: string
          company_description: string
          company_name: string
          companyEmail: string
          context: string
          createAt: string
          crm_users: number
          default_lang: string
          eleven_labs_id: string | null
          eleven_labs_key: string | null
          eleven_labs_last_create: string | null
          flow: string
          id: number
          last_crm_users_change: string | null
          logs: string
          modelIa: string
          monthly_chats: string
          monthly_tokens: string
          mp_access_token: string | null
          name: string
          plataform_ia: string
          plataform_key: string | null
          running_id: string | null
          status: string
          user_id: number
          website: string
        }
        Insert: {
          agenda?: string
          ai_personality?: string
          ai_usage?: string
          apprenticeship?: string
          companeyTel?: string
          company_description?: string
          company_name?: string
          companyEmail?: string
          context?: string
          createAt?: string
          crm_users?: number
          default_lang?: string
          eleven_labs_id?: string | null
          eleven_labs_key?: string | null
          eleven_labs_last_create?: string | null
          flow?: string
          id?: number
          last_crm_users_change?: string | null
          logs?: string
          modelIa?: string
          monthly_chats?: string
          monthly_tokens?: string
          mp_access_token?: string | null
          name: string
          plataform_ia?: string
          plataform_key?: string | null
          running_id?: string | null
          status: string
          user_id: number
          website?: string
        }
        Update: {
          agenda?: string
          ai_personality?: string
          ai_usage?: string
          apprenticeship?: string
          companeyTel?: string
          company_description?: string
          company_name?: string
          companyEmail?: string
          context?: string
          createAt?: string
          crm_users?: number
          default_lang?: string
          eleven_labs_id?: string | null
          eleven_labs_key?: string | null
          eleven_labs_last_create?: string | null
          flow?: string
          id?: number
          last_crm_users_change?: string | null
          logs?: string
          modelIa?: string
          monthly_chats?: string
          monthly_tokens?: string
          mp_access_token?: string | null
          name?: string
          plataform_ia?: string
          plataform_key?: string | null
          running_id?: string | null
          status?: string
          user_id?: number
          website?: string
        }
        Relationships: []
      }
      ai_agents: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          personality: string | null
          training_data: string | null
          updated_at: string
          user_id: string
          voice_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          personality?: string | null
          training_data?: string | null
          updated_at?: string
          user_id: string
          voice_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          personality?: string | null
          training_data?: string | null
          updated_at?: string
          user_id?: string
          voice_enabled?: boolean | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          createAt: string
          crm: number
          cron: string
          email_body: string | null
          email_subject: string | null
          end_with: string
          id: number
          logs: string[] | null
          name: string
          send_per: string
          send_with: string
          shots: number
          start_with: string
          tags: string[] | null
          updateAt: string
          whatsapp_body: string | null
        }
        Insert: {
          createAt?: string
          crm: number
          cron: string
          email_body?: string | null
          email_subject?: string | null
          end_with: string
          id?: number
          logs?: string[] | null
          name: string
          send_per: string
          send_with?: string
          shots: number
          start_with: string
          tags?: string[] | null
          updateAt: string
          whatsapp_body?: string | null
        }
        Update: {
          createAt?: string
          crm?: number
          cron?: string
          email_body?: string | null
          email_subject?: string | null
          end_with?: string
          id?: number
          logs?: string[] | null
          name?: string
          send_per?: string
          send_with?: string
          shots?: number
          start_with?: string
          tags?: string[] | null
          updateAt?: string
          whatsapp_body?: string | null
        }
        Relationships: []
      }
      contact: {
        Row: {
          abandon: boolean
          agente_id: number
          createAt: string
          id: number
          locked: boolean
          messages: string
          name: string
          number: string
          updateAt: string
          user_find: number | null
        }
        Insert: {
          abandon?: boolean
          agente_id: number
          createAt?: string
          id?: number
          locked?: boolean
          messages: string
          name: string
          number: string
          updateAt?: string
          user_find?: number | null
        }
        Update: {
          abandon?: boolean
          agente_id?: number
          createAt?: string
          id?: number
          locked?: boolean
          messages?: string
          name?: string
          number?: string
          updateAt?: string
          user_find?: number | null
        }
        Relationships: []
      }
      conversion: {
        Row: {
          agente_id: number
          create_at: string
          data: string
          id: number
          precise_metrics: string
          update_at: string
          user_id: number
        }
        Insert: {
          agente_id: number
          create_at?: string
          data?: string
          id?: number
          precise_metrics?: string
          update_at?: string
          user_id: number
        }
        Update: {
          agente_id?: number
          create_at?: string
          data?: string
          id?: number
          precise_metrics?: string
          update_at?: string
          user_id?: number
        }
        Relationships: []
      }
      crm: {
        Row: {
          agente_id: number
          cards: string
          cards_sessions: string[] | null
          createAt: string
          ia_resume: string
          ia_resume_update: string
          id: number
          maxUsers: number
          metrics: string
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: string | null
          smtp_secure: boolean
          smtp_user: string | null
          tags: string[] | null
          updateAt: string
          users: string[] | null
        }
        Insert: {
          agente_id: number
          cards?: string
          cards_sessions?: string[] | null
          createAt?: string
          ia_resume?: string
          ia_resume_update?: string
          id?: number
          maxUsers?: number
          metrics?: string
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: string | null
          smtp_secure?: boolean
          smtp_user?: string | null
          tags?: string[] | null
          updateAt?: string
          users?: string[] | null
        }
        Update: {
          agente_id?: number
          cards?: string
          cards_sessions?: string[] | null
          createAt?: string
          ia_resume?: string
          ia_resume_update?: string
          id?: number
          maxUsers?: number
          metrics?: string
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: string | null
          smtp_secure?: boolean
          smtp_user?: string | null
          tags?: string[] | null
          updateAt?: string
          users?: string[] | null
        }
        Relationships: []
      }
      integration_crm: {
        Row: {
          createAt: string
          crm: number
          fallback_url: string | null
          id: number
          name: string
        }
        Insert: {
          createAt?: string
          crm: number
          fallback_url?: string | null
          id?: number
          name: string
        }
        Update: {
          createAt?: string
          crm?: number
          fallback_url?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          agente_id: number
          createAt: string
          id: number
          integration_name: string
          public_id: string
          updateAt: string
          user_id: number
        }
        Insert: {
          agente_id: number
          createAt?: string
          id?: number
          integration_name: string
          public_id: string
          updateAt?: string
          user_id: number
        }
        Update: {
          agente_id?: number
          createAt?: string
          id?: number
          integration_name?: string
          public_id?: string
          updateAt?: string
          user_id?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          action: string
          createAt: string
          crmAgenteId: number | null
          description: string
          discount: number
          expire_payment_link: string | null
          external_reference: string | null
          footer: string
          id: number
          maturity: string
          maxUsersCrm: number | null
          paidAt: string | null
          plan: string | null
          status: string
          url: string | null
          user_id: number
          userEmail: string | null
          value: number
        }
        Insert: {
          action: string
          createAt?: string
          crmAgenteId?: number | null
          description: string
          discount: number
          expire_payment_link?: string | null
          external_reference?: string | null
          footer: string
          id?: number
          maturity: string
          maxUsersCrm?: number | null
          paidAt?: string | null
          plan?: string | null
          status: string
          url?: string | null
          user_id: number
          userEmail?: string | null
          value: number
        }
        Update: {
          action?: string
          createAt?: string
          crmAgenteId?: number | null
          description?: string
          discount?: number
          expire_payment_link?: string | null
          external_reference?: string | null
          footer?: string
          id?: number
          maturity?: string
          maxUsersCrm?: number | null
          paidAt?: string | null
          plan?: string | null
          status?: string
          url?: string | null
          user_id?: number
          userEmail?: string | null
          value?: number
        }
        Relationships: []
      }
      quick_messages: {
        Row: {
          agente_id: number
          createAt: string
          id: number
          messages: string[] | null
          user_id: number
        }
        Insert: {
          agente_id: number
          createAt?: string
          id?: number
          messages?: string[] | null
          user_id: number
        }
        Update: {
          agente_id?: number
          createAt?: string
          id?: number
          messages?: string[] | null
          user_id?: number
        }
        Relationships: []
      }
      reedem_passwords: {
        Row: {
          code: string
          createAt: string
          id: number
          user_email: string
          user_id: number
        }
        Insert: {
          code: string
          createAt?: string
          id?: number
          user_email: string
          user_id: number
        }
        Update: {
          code?: string
          createAt?: string
          id?: number
          user_email?: string
          user_id?: number
        }
        Relationships: []
      }
      subusers: {
        Row: {
          agente_id: number
          createAt: string
          id: number
          permissions: string
          real_user_id: number
          realUserEmail: string
          updateAt: string
        }
        Insert: {
          agente_id: number
          createAt?: string
          id?: number
          permissions: string
          real_user_id: number
          realUserEmail: string
          updateAt?: string
        }
        Update: {
          agente_id?: number
          createAt?: string
          id?: number
          permissions?: string
          real_user_id?: number
          realUserEmail?: string
          updateAt?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          agenteId: number | null
          createAt: string
          id: number
          identification: string
          lastUse: string
          mimeType: string
          name: string | null
          size: string
          type: string
          url: string
          user_id: number
        }
        Insert: {
          agenteId?: number | null
          createAt?: string
          id?: number
          identification: string
          lastUse?: string
          mimeType: string
          name?: string | null
          size: string
          type: string
          url: string
          user_id: number
        }
        Update: {
          agenteId?: number | null
          createAt?: string
          id?: number
          identification?: string
          lastUse?: string
          mimeType?: string
          name?: string | null
          size?: string
          type?: string
          url?: string
          user_id?: number
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          id: string
          max_agents: number
          plan_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_agents?: number
          plan_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_agents?: number
          plan_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_token: string | null
          createAt: string
          email: string
          id: number
          lastLogin: string
          lastname: string
          login_method: string
          name: string
          number_agentes: number
          password: string
          plan: string
          primary_invoice_paid: boolean
          profileExpire: string | null
          updateAt: string
          username: string
          verification: string
        }
        Insert: {
          auth_token?: string | null
          createAt?: string
          email: string
          id?: number
          lastLogin?: string
          lastname: string
          login_method: string
          name: string
          number_agentes?: number
          password: string
          plan?: string
          primary_invoice_paid?: boolean
          profileExpire?: string | null
          updateAt?: string
          username: string
          verification: string
        }
        Update: {
          auth_token?: string | null
          createAt?: string
          email?: string
          id?: number
          lastLogin?: string
          lastname?: string
          login_method?: string
          name?: string
          number_agentes?: number
          password?: string
          plan?: string
          primary_invoice_paid?: boolean
          profileExpire?: string | null
          updateAt?: string
          username?: string
          verification?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          agente_id: number
          createAt: string
          endpoint: string
          events: string[] | null
          id: number
          lastDispatch: string
          updateAt: string
          user_id: number
        }
        Insert: {
          agente_id: number
          createAt?: string
          endpoint: string
          events?: string[] | null
          id?: number
          lastDispatch?: string
          updateAt?: string
          user_id: number
        }
        Update: {
          agente_id?: number
          createAt?: string
          endpoint?: string
          events?: string[] | null
          id?: number
          lastDispatch?: string
          updateAt?: string
          user_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
