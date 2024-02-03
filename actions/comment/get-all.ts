"use server";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const getAllComments = async (postId: string, page: number) => {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const from = page === 1 ? 0 : page * 3;
    const to = page === 1 ? 2 : from + 2;

    const { data, error } = await supabase
      .from("comments")
      .select("*, users(*), posts(*)")
      .order("created_at", { ascending: false })
      .eq("post", postId)
      .range(from, to);

    return { data };
  } catch (error) {
    return { error: error };
  }
};
