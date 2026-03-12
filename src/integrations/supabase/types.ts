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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      interventions: {
        Row: {
          baseline_conditions: Json | null
          code: string
          confidence_at_issue: number
          created_at: string
          date_implemented: string | null
          date_recommended: string
          expert_annotations: Json | null
          id: string
          learning_delta: string | null
          linked_datasets: Json | null
          location: string
          rationale: string | null
          status: string
          timeline: Json | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          baseline_conditions?: Json | null
          code: string
          confidence_at_issue: number
          created_at?: string
          date_implemented?: string | null
          date_recommended: string
          expert_annotations?: Json | null
          id?: string
          learning_delta?: string | null
          linked_datasets?: Json | null
          location: string
          rationale?: string | null
          status?: string
          timeline?: Json | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          baseline_conditions?: Json | null
          code?: string
          confidence_at_issue?: number
          created_at?: string
          date_implemented?: string | null
          date_recommended?: string
          expert_annotations?: Json | null
          id?: string
          learning_delta?: string | null
          linked_datasets?: Json | null
          location?: string
          rationale?: string | null
          status?: string
          timeline?: Json | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      model_versions: {
        Row: {
          affected_domains: string[] | null
          created_at: string
          id: string
          parameter_shifts: Json | null
          trigger_description: string
          version_from: string
          version_to: string
        }
        Insert: {
          affected_domains?: string[] | null
          created_at?: string
          id?: string
          parameter_shifts?: Json | null
          trigger_description: string
          version_from: string
          version_to: string
        }
        Update: {
          affected_domains?: string[] | null
          created_at?: string
          id?: string
          parameter_shifts?: Json | null
          trigger_description?: string
          version_from?: string
          version_to?: string
        }
        Relationships: []
      }
      outcomes: {
        Row: {
          actual: string | null
          created_at: string
          delta: string | null
          favorable: boolean | null
          id: string
          intervention_id: string
          measured_at: string | null
          metric: string
          predicted: string
        }
        Insert: {
          actual?: string | null
          created_at?: string
          delta?: string | null
          favorable?: boolean | null
          id?: string
          intervention_id: string
          measured_at?: string | null
          metric: string
          predicted: string
        }
        Update: {
          actual?: string | null
          created_at?: string
          delta?: string | null
          favorable?: boolean | null
          id?: string
          intervention_id?: string
          measured_at?: string | null
          metric?: string
          predicted?: string
        }
        Relationships: [
          {
            foreignKeyName: "outcomes_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_patterns: {
        Row: {
          confidence: string
          created_at: string
          domains: string[] | null
          id: string
          insight: string
          source: string
          updated_at: string
        }
        Insert: {
          confidence: string
          created_at?: string
          domains?: string[] | null
          id?: string
          insight: string
          source: string
          updated_at?: string
        }
        Update: {
          confidence?: string
          created_at?: string
          domains?: string[] | null
          id?: string
          insight?: string
          source?: string
          updated_at?: string
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
