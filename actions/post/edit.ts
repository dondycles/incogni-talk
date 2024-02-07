"use server";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const editPost = async (values?: any) => {
  console.log(values);
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

  const { error: editPostError, data: postData } = await supabase
    .from("posts")
    .update({
      content: values.content,
      privacy: values.privacy,
    })
    .eq("id", values.id)
    .select();

  if (editPostError) return { error: editPostError.message };

  const { error: historyError } = await supabase
    .from("post_edits_history")
    .insert({
      data: postData,
      post: values.id,
    })
    .eq("id", values.id);

  if (historyError) return { error: historyError.message };

  return { success: "post edited" };
};
