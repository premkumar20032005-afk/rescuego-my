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
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'provider' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'provider' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'provider' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          owner_id: string
          plate_number: string
          make: string
          model: string
          year: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          plate_number: string
          make: string
          model: string
          year?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          plate_number?: string
          make?: string
          model?: string
          year?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          slug: string
          name: string
          icon: string | null
          base_price_min: number | null
          base_price_max: number | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          icon?: string | null
          base_price_min?: number | null
          base_price_max?: number | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          icon?: string | null
          base_price_min?: number | null
          base_price_max?: number | null
          active?: boolean
          created_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          customer_id: string
          vehicle_id: string | null
          category_id: string
          provider_id: string | null
          status: 'pending' | 'accepted' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
          lat: number
          lng: number
          address_text: string
          description: string | null
          photos: Json
          created_at: string
          accepted_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          vehicle_id?: string | null
          category_id: string
          provider_id?: string | null
          status?: 'pending' | 'accepted' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
          lat: number
          lng: number
          address_text: string
          description?: string | null
          photos?: Json
          created_at?: string
          accepted_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          vehicle_id?: string | null
          category_id?: string
          provider_id?: string | null
          status?: 'pending' | 'accepted' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
          lat?: number
          lng?: number
          address_text?: string
          description?: string | null
          photos?: Json
          created_at?: string
          accepted_at?: string | null
          completed_at?: string | null
        }
      }
      request_status_events: {
        Row: {
          id: string
          request_id: string
          status: 'pending' | 'accepted' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          status: 'pending' | 'accepted' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          status?: 'pending' | 'accepted' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          request_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
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
      user_role: 'customer' | 'provider' | 'admin'
      request_status: 'pending' | 'accepted' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
