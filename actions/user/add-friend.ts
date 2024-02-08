"use server";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const addFriend = async (userId: string, unfriend: boolean) => {
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

  if (unfriend) {
    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("friend", userId);
    if (error) return { error: error.message };

    return { success: "friend request cancelled!" };
  }

  const { error } = await supabase.from("friends").insert({
    friend: userId,
  });
  if (error) return { error: error.message };

  return { success: "friend request sent!" };
};
