"use server";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const editComment = async (values: any) => {
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

  const { error, data: commentData } = await supabase
    .from("comments")
    .update({
      content: values.content,
    })
    .eq("id", values.id)
    .select();

  if (error) return { error: error.message };

  const { error: historyError } = await supabase
    .from("comment_edits_history")
    .insert({
      data: commentData,
      comment: values.id,
    })
    .eq("id", values.id);

  if (historyError) return { error: historyError.message };

  return { success: "comment edited" };
};
