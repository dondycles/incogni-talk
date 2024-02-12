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
      comment_edits_history: {
        Row: {
          comment: string
          created_at: string
          data: Json
          id: string
          user: string
        }
        Insert: {
          comment: string
          created_at?: string
          data: Json
          id?: string
          user?: string
        }
        Update: {
          comment?: string
          created_at?: string
          data?: Json
          id?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_edits_history_comment_fkey"
            columns: ["comment"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_edits_history_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          commenter: string
          content: string
          created_at: string
          id: string
          post: string
        }
        Insert: {
          commenter?: string
          content: string
          created_at?: string
          id?: string
          post: string
        }
        Update: {
          commenter?: string
          content?: string
          created_at?: string
          id?: string
          post?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_commenter_fkey"
            columns: ["commenter"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      friends: {
        Row: {
          accepted: boolean
          accepted_at: string | null
          created_at: string
          id: number
          receiver: string
          requester: string
        }
        Insert: {
          accepted?: boolean
          accepted_at?: string | null
          created_at?: string
          id?: number
          receiver: string
          requester?: string
        }
        Update: {
          accepted?: boolean
          accepted_at?: string | null
          created_at?: string
          id?: number
          receiver?: string
          requester?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_receiver_fkey"
            columns: ["receiver"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      hidden_posts: {
        Row: {
          created_at: string
          id: number
          post: string
          user: string
        }
        Insert: {
          created_at?: string
          id?: number
          post: string
          user?: string
        }
        Update: {
          created_at?: string
          id?: number
          post?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "hidden_posts_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hidden_posts_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          liker: string
          post: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          liker?: string
          post?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          liker?: string
          post?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_fkey"
            columns: ["comment"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_liker_fkey"
            columns: ["liker"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      post_edits_history: {
        Row: {
          created_at: string
          data: Json
          id: string
          post: string
          user: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          post: string
          user?: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          post?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_edits_history_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_edits_history_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          author: string
          content: string | null
          created_at: string
          id: string
          privacy: string
          shared_post: string | null
        }
        Insert: {
          author?: string
          content?: string | null
          created_at?: string
          id?: string
          privacy: string
          shared_post?: string | null
        }
        Update: {
          author?: string
          content?: string | null
          created_at?: string
          id?: string
          privacy?: string
          shared_post?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_shared_post_fkey"
            columns: ["shared_post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      ug_comments: {
        Row: {
          comment: string
          commenter: string
          content: string
          created_at: string
          id: string
          post: string
        }
        Insert: {
          comment: string
          commenter?: string
          content: string
          created_at?: string
          id?: string
          post: string
        }
        Update: {
          comment?: string
          commenter?: string
          content?: string
          created_at?: string
          id?: string
          post?: string
        }
        Relationships: [
          {
            foreignKeyName: "ug_comments_comment_fkey"
            columns: ["comment"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ug_comments_commenter_fkey"
            columns: ["commenter"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ug_comments_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          username?: string
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
