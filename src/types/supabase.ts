export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          title: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          status: string | null
          created_at: string
          source: string | null
          assigned_to: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          status?: string | null
          created_at?: string
          source?: string | null
          assigned_to?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          status?: string | null
          created_at?: string
          source?: string | null
          assigned_to?: string | null
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          permissions: string[]
          parent_id: string | null
          status: string
          created_at: string
          updated_at: string
          fcm_token: string | null
          device_type: string | null
          user_agent: string | null
          token_active: boolean | null
          last_token_refresh: string | null
          phone: string | null
          organization_token: string | null
          is_available_for_calls: boolean | null
          last_seen: string | null
          current_call_id: string | null
          preferences: Json | null
          organization_id: string | null
          password_hash: string | null
          features: string[]
          lead_statuses: string[]
          profile_image: string | null
          employee_id: string | null
          date_of_joining: string | null
          date_of_birth: string | null
          department: string | null
          designation: string | null
          employment_type: string | null
          employment_status: string | null
          salary: number | null
          bank_account_number: string | null
          bank_ifsc: string | null
          pan_number: string | null
          aadhaar_number: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          address: string | null
          city: string | null
          state: string | null
          pincode: string | null
          reporting_manager_id: string | null
          hr_manager_id: string | null
          biometric_id: string | null
          last_attendance_sync: string | null
          resume_path: string | null
          onboarding_status: string | null
          source: string | null
          profile_type: string | null
          is_approved: boolean | null
          callerdesk_member_id: number | null
          callerdesk_token: string | null
          callerdesk_extension: string | null
          tata_extension: string | null
          agent_type: string | null
          google_id: string | null
          auth_provider: string | null
          email_verified: boolean | null
          last_login: string | null
          last_logout: string | null
          picture: string | null
          form_type: string | null
          expo_push_token: string | null
          expo_token_active: boolean | null
          expo_token_updated_at: string | null
          shift_id: string | null
          working_day_plan_id: string | null
          per_day_salary: number | null
          per_hour_salary: number | null
          overtime_rate: number | null
          deduction_per_late: number | null
          salary_allowances: Json | null
          salary_deductions: Json | null
          pf_enabled: boolean | null
          pf_amount: number | null
          esi_enabled: boolean | null
          esi_amount: number | null
          temp_password: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: string
          permissions?: string[]
          parent_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          fcm_token?: string | null
          device_type?: string | null
          user_agent?: string | null
          token_active?: boolean | null
          last_token_refresh?: string | null
          phone?: string | null
          organization_token?: string | null
          is_available_for_calls?: boolean | null
          last_seen?: string | null
          current_call_id?: string | null
          preferences?: Json | null
          organization_id?: string | null
          password_hash?: string | null
          features?: string[]
          lead_statuses?: string[]
          profile_image?: string | null
          employee_id?: string | null
          date_of_joining?: string | null
          date_of_birth?: string | null
          department?: string | null
          designation?: string | null
          employment_type?: string | null
          employment_status?: string | null
          salary?: number | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          pan_number?: string | null
          aadhaar_number?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          reporting_manager_id?: string | null
          hr_manager_id?: string | null
          biometric_id?: string | null
          last_attendance_sync?: string | null
          resume_path?: string | null
          onboarding_status?: string | null
          source?: string | null
          profile_type?: string | null
          is_approved?: boolean | null
          callerdesk_member_id?: number | null
          callerdesk_token?: string | null
          callerdesk_extension?: string | null
          tata_extension?: string | null
          agent_type?: string | null
          google_id?: string | null
          auth_provider?: string | null
          email_verified?: boolean | null
          last_login?: string | null
          last_logout?: string | null
          picture?: string | null
          form_type?: string | null
          expo_push_token?: string | null
          expo_token_active?: boolean | null
          expo_token_updated_at?: string | null
          shift_id?: string | null
          working_day_plan_id?: string | null
          per_day_salary?: number | null
          per_hour_salary?: number | null
          overtime_rate?: number | null
          deduction_per_late?: number | null
          salary_allowances?: Json | null
          salary_deductions?: Json | null
          pf_enabled?: boolean | null
          pf_amount?: number | null
          esi_enabled?: boolean | null
          esi_amount?: number | null
          temp_password?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          permissions?: string[]
          parent_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          fcm_token?: string | null
          device_type?: string | null
          user_agent?: string | null
          token_active?: boolean | null
          last_token_refresh?: string | null
          phone?: string | null
          organization_token?: string | null
          is_available_for_calls?: boolean | null
          last_seen?: string | null
          current_call_id?: string | null
          preferences?: Json | null
          organization_id?: string | null
          password_hash?: string | null
          features?: string[]
          lead_statuses?: string[]
          profile_image?: string | null
          employee_id?: string | null
          date_of_joining?: string | null
          date_of_birth?: string | null
          department?: string | null
          designation?: string | null
          employment_type?: string | null
          employment_status?: string | null
          salary?: number | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          pan_number?: string | null
          aadhaar_number?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          reporting_manager_id?: string | null
          hr_manager_id?: string | null
          biometric_id?: string | null
          last_attendance_sync?: string | null
          resume_path?: string | null
          onboarding_status?: string | null
          source?: string | null
          profile_type?: string | null
          is_approved?: boolean | null
          callerdesk_member_id?: number | null
          callerdesk_token?: string | null
          callerdesk_extension?: string | null
          tata_extension?: string | null
          agent_type?: string | null
          google_id?: string | null
          auth_provider?: string | null
          email_verified?: boolean | null
          last_login?: string | null
          last_logout?: string | null
          picture?: string | null
          form_type?: string | null
          expo_push_token?: string | null
          expo_token_active?: boolean | null
          expo_token_updated_at?: string | null
          shift_id?: string | null
          working_day_plan_id?: string | null
          per_day_salary?: number | null
          per_hour_salary?: number | null
          overtime_rate?: number | null
          deduction_per_late?: number | null
          salary_allowances?: Json | null
          salary_deductions?: Json | null
          pf_enabled?: boolean | null
          pf_amount?: number | null
          esi_enabled?: boolean | null
          esi_amount?: number | null
          temp_password?: string | null
        }
      }
      health_check: {
        Row: {
          id: string
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          status: string
        }
        Update: {
          id?: string
          created_at?: string
          status?: string
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
      [_ in never]: never
    }
  }
}
