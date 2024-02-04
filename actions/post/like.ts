"use server";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const likePost = async (
  postId: string,
  liked: boolean,
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
      },
    }
  );

  // if liked, it will unlike the post
  if (liked) {
    const { error } = await supabase.from("likes").delete().eq("liker", userId);
    if (error) return { error: error.message };
    return { success: "post unliked" };
  }
  const { error } = await supabase.from("likes").insert({ post: postId });
  if (error) return { error: error.message };
  return { success: "post liked" };
};
