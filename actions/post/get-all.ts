"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const getAllPosts = async (page: number) => {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
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
    const from = page === 1 ? 0 : page * 1;
    const to = page === 1 ? 1 : from + 1;
    const { data } = await supabase
      .from("posts")
      // .select("*, users(*), comments(*, users(*)), likes(*, users(*))")
      .select("id")
      .order("created_at", { ascending: false })
      .range(from, to);

    return { data };
  } catch (error) {
    return { error: error };
  }
};
