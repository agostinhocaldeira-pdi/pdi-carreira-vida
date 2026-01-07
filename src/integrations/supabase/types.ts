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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievement_definitions: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points: number
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points?: number
          requirement_type: string
          requirement_value: number
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          cnpj: string
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          owner_user_id: string | null
          razao_social: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cnpj: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          owner_user_id?: string | null
          razao_social: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          owner_user_id?: string | null
          razao_social?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_employees: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string
          email: string
          id: string
          invited_at: string
          is_active: boolean | null
          is_subscription_exempt: boolean | null
          manager_id: string | null
          name: string
          password_setup_sent_at: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string
          email: string
          id?: string
          invited_at?: string
          is_active?: boolean | null
          is_subscription_exempt?: boolean | null
          manager_id?: string | null
          name: string
          password_setup_sent_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string
          email?: string
          id?: string
          invited_at?: string
          is_active?: boolean | null
          is_subscription_exempt?: boolean | null
          manager_id?: string | null
          name?: string
          password_setup_sent_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_managers: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string
          email: string
          id: string
          invited_at: string
          is_active: boolean | null
          name: string
          password_setup_sent_at: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string
          email: string
          id?: string
          invited_at?: string
          is_active?: boolean | null
          name: string
          password_setup_sent_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string
          email?: string
          id?: string
          invited_at?: string
          is_active?: boolean | null
          name?: string
          password_setup_sent_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_managers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_okr_employee_links: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          okr_id: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          okr_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          okr_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_okr_employee_links_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "company_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_okr_employee_links_okr_id_fkey"
            columns: ["okr_id"]
            isOneToOne: false
            referencedRelation: "company_okrs"
            referencedColumns: ["id"]
          },
        ]
      }
      company_okrs: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          period_end: string
          period_start: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          period_end: string
          period_start: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          period_end?: string
          period_start?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_okrs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_representatives: {
        Row: {
          company_id: string
          created_at: string
          email: string
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_representatives_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      data_deletion_requests: {
        Row: {
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          conquests: string | null
          created_at: string | null
          daily_progress: string | null
          entry_date: string
          gratitude: string | null
          habits: string[] | null
          id: string
          mood: string | null
          reflections: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conquests?: string | null
          created_at?: string | null
          daily_progress?: string | null
          entry_date: string
          gratitude?: string | null
          habits?: string[] | null
          id?: string
          mood?: string | null
          reflections?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conquests?: string | null
          created_at?: string | null
          daily_progress?: string | null
          entry_date?: string
          gratitude?: string | null
          habits?: string[] | null
          id?: string
          mood?: string | null
          reflections?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          confirmation_token: string | null
          created_at: string
          ebook_downloaded: boolean | null
          email: string
          email_confirmed: boolean | null
          id: string
          name: string
          phone: string | null
          source: string
          updated_at: string
        }
        Insert: {
          confirmation_token?: string | null
          created_at?: string
          ebook_downloaded?: boolean | null
          email: string
          email_confirmed?: boolean | null
          id?: string
          name: string
          phone?: string | null
          source?: string
          updated_at?: string
        }
        Update: {
          confirmation_token?: string | null
          created_at?: string
          ebook_downloaded?: boolean | null
          email?: string
          email_confirmed?: boolean | null
          id?: string
          name?: string
          phone?: string | null
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      okr_key_results: {
        Row: {
          created_at: string
          current_value: number
          id: string
          okr_id: string
          target_value: number
          title: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          id?: string
          okr_id: string
          target_value: number
          title: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number
          id?: string
          okr_id?: string
          target_value?: number
          title?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "okr_key_results_okr_id_fkey"
            columns: ["okr_id"]
            isOneToOne: false
            referencedRelation: "company_okrs"
            referencedColumns: ["id"]
          },
        ]
      }
      satisfaction_surveys: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          rating: number
          section: string
          survey_type: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating: number
          section: string
          survey_type: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number
          section?: string
          survey_type?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stoic_reflection_audio: {
        Row: {
          audio_url: string
          created_at: string
          date_key: string
          id: string
          title: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          date_key: string
          id?: string
          title: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          date_key?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string | null
          id: string
          is_admin_response: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_admin_response?: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin_response?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: Database["public"]["Enums"]["support_category"]
          created_at: string | null
          id: string
          question: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["support_category"]
          created_at?: string | null
          id?: string
          question: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["support_category"]
          created_at?: string | null
          id?: string
          question?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievement_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_actions: {
        Row: {
          created_at: string | null
          goal_id: string | null
          id: string
          periodicidade: string | null
          status: string | null
          texto: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          goal_id?: string | null
          id?: string
          periodicidade?: string | null
          status?: string | null
          texto: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          goal_id?: string | null
          id?: string
          periodicidade?: string | null
          status?: string | null
          texto?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "user_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          bairro: string | null
          cep: string
          cidade: string
          complemento: string | null
          created_at: string
          estado: string
          id: string
          logradouro: string | null
          numero: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bairro?: string | null
          cep: string
          cidade: string
          complemento?: string | null
          created_at?: string
          estado: string
          id?: string
          logradouro?: string | null
          numero?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bairro?: string | null
          cep?: string
          cidade?: string
          complemento?: string | null
          created_at?: string
          estado?: string
          id?: string
          logradouro?: string | null
          numero?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_ai_purchases: {
        Row: {
          amount_paid: number
          created_at: string
          feature_type: string
          id: string
          paid_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number
          created_at?: string
          feature_type: string
          id?: string
          paid_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          feature_type?: string
          id?: string
          paid_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_beliefs: {
        Row: {
          created_at: string | null
          id: string
          limiting_belief: string
          new_belief: string | null
          transformation_answers: Json | null
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          limiting_belief: string
          new_belief?: string | null
          transformation_answers?: Json | null
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          limiting_belief?: string
          new_belief?: string | null
          transformation_answers?: Json | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_type: string
          consent_version: string | null
          consented_at: string
          created_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_type: string
          consent_version?: string | null
          consented_at?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_type?: string
          consent_version?: string | null
          consented_at?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_eisenhower_tasks: {
        Row: {
          created_at: string | null
          id: string
          quadrant: string
          task_text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          quadrant: string
          task_text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          quadrant?: string
          task_text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          created_at: string | null
          data_alvo: string | null
          from_smart: boolean | null
          id: string
          objective_id: string | null
          status: string | null
          texto: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_alvo?: string | null
          from_smart?: boolean | null
          id?: string
          objective_id?: string | null
          status?: string | null
          texto: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_alvo?: string | null
          from_smart?: boolean | null
          id?: string
          objective_id?: string | null
          status?: string | null
          texto?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_goals_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "user_objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      user_insights: {
        Row: {
          created_at: string | null
          generated_at: string | null
          id: string
          insight_text: string | null
          plano_vida_email_sent: boolean
          user_id: string
        }
        Insert: {
          created_at?: string | null
          generated_at?: string | null
          id?: string
          insight_text?: string | null
          plano_vida_email_sent?: boolean
          user_id: string
        }
        Update: {
          created_at?: string | null
          generated_at?: string | null
          id?: string
          insight_text?: string | null
          plano_vida_email_sent?: boolean
          user_id?: string
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          access_token: string | null
          connected_at: string | null
          created_at: string
          id: string
          integration_type: string
          is_connected: boolean
          last_sync_at: string | null
          refresh_token: string | null
          settings: Json | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connected_at?: string | null
          created_at?: string
          id?: string
          integration_type: string
          is_connected?: boolean
          last_sync_at?: string | null
          refresh_token?: string | null
          settings?: Json | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          connected_at?: string | null
          created_at?: string
          id?: string
          integration_type?: string
          is_connected?: boolean
          last_sync_at?: string | null
          refresh_token?: string | null
          settings?: Json | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_life_areas: {
        Row: {
          area_name: string
          created_at: string | null
          current_score: number | null
          desired_score: number | null
          id: string
          position: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          area_name: string
          created_at?: string | null
          current_score?: number | null
          desired_score?: number | null
          id?: string
          position?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          area_name?: string
          created_at?: string | null
          current_score?: number | null
          desired_score?: number | null
          id?: string
          position?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string
          diary_reminder_enabled: boolean
          diary_reminder_time: string
          email_enabled: boolean
          goal_deadline_days_before: number
          goal_deadline_reminder: boolean
          id: string
          updated_at: string
          user_id: string
          weekly_summary_day: number
          weekly_summary_enabled: boolean
          whatsapp_enabled: boolean
        }
        Insert: {
          created_at?: string
          diary_reminder_enabled?: boolean
          diary_reminder_time?: string
          email_enabled?: boolean
          goal_deadline_days_before?: number
          goal_deadline_reminder?: boolean
          id?: string
          updated_at?: string
          user_id: string
          weekly_summary_day?: number
          weekly_summary_enabled?: boolean
          whatsapp_enabled?: boolean
        }
        Update: {
          created_at?: string
          diary_reminder_enabled?: boolean
          diary_reminder_time?: string
          email_enabled?: boolean
          goal_deadline_days_before?: number
          goal_deadline_reminder?: boolean
          id?: string
          updated_at?: string
          user_id?: string
          weekly_summary_day?: number
          weekly_summary_enabled?: boolean
          whatsapp_enabled?: boolean
        }
        Relationships: []
      }
      user_objectives: {
        Row: {
          conexao_vvd: string | null
          created_at: string | null
          data_alvo: string | null
          id: string
          status: string | null
          texto: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conexao_vvd?: string | null
          created_at?: string | null
          data_alvo?: string | null
          id?: string
          status?: string | null
          texto: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conexao_vvd?: string | null
          created_at?: string | null
          data_alvo?: string | null
          id?: string
          status?: string | null
          texto?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_okr_links: {
        Row: {
          contribution_percentage: number | null
          created_at: string
          id: string
          objetivo_id: string
          okr_id: string
          user_id: string
        }
        Insert: {
          contribution_percentage?: number | null
          created_at?: string
          id?: string
          objetivo_id: string
          okr_id: string
          user_id: string
        }
        Update: {
          contribution_percentage?: number | null
          created_at?: string
          id?: string
          objetivo_id?: string
          okr_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_okr_links_okr_id_fkey"
            columns: ["okr_id"]
            isOneToOne: false
            referencedRelation: "company_okrs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          created_at: string
          current_phase: string | null
          expectations: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_phase?: string | null
          expectations?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_phase?: string | null
          expectations?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_self_assessment: {
        Row: {
          ai_analysis: string | null
          created_at: string | null
          feedback_360: string | null
          id: string
          last_completed_at: string | null
          self_answers: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          created_at?: string | null
          feedback_360?: string | null
          id?: string
          last_completed_at?: string | null
          self_answers?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          created_at?: string | null
          feedback_360?: string | null
          id?: string
          last_completed_at?: string | null
          self_answers?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          skill_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          skill_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          skill_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_smart_ai_usage: {
        Row: {
          created_at: string
          free_usage_consumed: boolean
          id: string
          total_paid_usages: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          free_usage_consumed?: boolean
          id?: string
          total_paid_usages?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          free_usage_consumed?: boolean
          id?: string
          total_paid_usages?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_steps: {
        Row: {
          action_id: string | null
          concluido: boolean | null
          created_at: string | null
          id: string
          texto: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_id?: string | null
          concluido?: boolean | null
          created_at?: string | null
          id?: string
          texto: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_id?: string | null
          concluido?: boolean | null
          created_at?: string | null
          id?: string
          texto?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_steps_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "user_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stoic_reflections: {
        Row: {
          created_at: string
          id: string
          reflection_date: string
          response: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reflection_date: string
          response?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reflection_date?: string
          response?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          current_streak: number
          id: string
          last_activity_date: string | null
          level: number
          longest_streak: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_strengths_weaknesses: {
        Row: {
          created_at: string | null
          id: string
          texto: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          texto: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          texto?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_surveys: {
        Row: {
          biggest_challenge: string | null
          created_at: string
          exercise_frequency: string | null
          id: string
          learning_style: string | null
          main_goal: string | null
          motivation_source: string | null
          reading_habit: string | null
          sleep_time: string | null
          updated_at: string
          user_id: string
          wake_up_time: string | null
        }
        Insert: {
          biggest_challenge?: string | null
          created_at?: string
          exercise_frequency?: string | null
          id?: string
          learning_style?: string | null
          main_goal?: string | null
          motivation_source?: string | null
          reading_habit?: string | null
          sleep_time?: string | null
          updated_at?: string
          user_id: string
          wake_up_time?: string | null
        }
        Update: {
          biggest_challenge?: string | null
          created_at?: string
          exercise_frequency?: string | null
          id?: string
          learning_style?: string | null
          main_goal?: string | null
          motivation_source?: string | null
          reading_habit?: string | null
          sleep_time?: string | null
          updated_at?: string
          user_id?: string
          wake_up_time?: string | null
        }
        Relationships: []
      }
      user_swot: {
        Row: {
          created_at: string | null
          id: string
          opportunities: string[] | null
          strengths: string[] | null
          threats: string[] | null
          updated_at: string | null
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunities?: string[] | null
          strengths?: string[] | null
          threats?: string[] | null
          updated_at?: string | null
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunities?: string[] | null
          strengths?: string[] | null
          threats?: string[] | null
          updated_at?: string | null
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      user_valores: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          valores: string[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          valores?: string[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          valores?: string[] | null
        }
        Relationships: []
      }
      user_vvd: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          vvd_paragraph: string | null
          vvd_sentence: string | null
          vvd_text: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          vvd_paragraph?: string | null
          vvd_sentence?: string | null
          vvd_text?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          vvd_paragraph?: string | null
          vvd_sentence?: string | null
          vvd_text?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      export_user_data: { Args: { target_user_id: string }; Returns: Json }
      get_employee_company_id: { Args: { _user_id: string }; Returns: string }
      get_manager_company_id: { Args: { _user_id: string }; Returns: string }
      get_manager_employee_user_ids: {
        Args: { _manager_user_id: string }
        Returns: string[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_company_employee: { Args: { _user_id: string }; Returns: boolean }
      is_company_manager: { Args: { _user_id: string }; Returns: boolean }
      is_company_owner: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
      user_owns_employee_company: {
        Args: { _company_id: string; _owner_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "gestor" | "empresa"
      support_category:
        | "progresso"
        | "diario"
        | "plano_de_vida"
        | "mao_na_massa"
        | "ferramentas"
        | "outros"
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
      app_role: ["admin", "user", "gestor", "empresa"],
      support_category: [
        "progresso",
        "diario",
        "plano_de_vida",
        "mao_na_massa",
        "ferramentas",
        "outros",
      ],
    },
  },
} as const
