"use server";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const acceptFriend = async (hoveredUserId: string, userId: string) => {
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

  const { error: e1 } = await supabase
    .from("friends")
    .update({
      accepted: true,
    })
    .eq("receiver", hoveredUserId)
    .eq("requester", userId);

  if (e1) return { error: e1.message };

  const { error: e2 } = await supabase
    .from("friends")
    .update({
      accepted: true,
    })
    .eq("receiver", userId)
    .eq("requester", hoveredUserId);
  if (e2) return { error: e2.message };

  return { success: "friend accepted sent!" };
};
