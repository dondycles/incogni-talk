"use server";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const addFriend = async (
  hoveredUserId: string,
  unfriend: boolean,
  userId: string
) => {
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
    const { error: e1 } = await supabase
      .from("friends")
      .delete()
      .eq("receiver", hoveredUserId)
      .eq("requester", userId);
    if (e1) return { error: e1.message };
    const { error: e2 } = await supabase
      .from("friends")
      .delete()
      .eq("receiver", userId)
      .eq("requester", hoveredUserId);
    if (e2) return { error: e2.message };
    return { success: "friend request cancelled!" };
  }

  const { data: d1, error: e1 } = await supabase
    .from("friends")
    .select("*")
    .eq("receiver", hoveredUserId)
    .eq("requester", userId);

  const { data: d2, error: e2 } = await supabase
    .from("friends")
    .select("*")
    .eq("receiver", userId)
    .eq("requester", hoveredUserId);

  if (d2?.length || d1?.length) {
    const { error: e1 } = await supabase
      .from("friends")
      .delete()
      .eq("receiver", hoveredUserId)
      .eq("requester", userId);
    if (e1) return { error: e1.message };
    const { error: e2 } = await supabase
      .from("friends")
      .delete()
      .eq("receiver", userId)
      .eq("requester", hoveredUserId);
    if (e2) return { error: e2.message };
    return { success: "friend request cancelled!" };
  }

  const { error, data } = await supabase
    .from("friends")
    .insert({
      receiver: hoveredUserId,
    })
    .select();
  console.log(error, data);
  if (error) return { error: error.message };

  return { success: "friend request sent!" };
};
