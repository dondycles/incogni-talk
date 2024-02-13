"use server";
import { addCommentFormSchema } from "./../../components/forms/add-comment";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import * as z from "zod";
export const addComment = async (
  values: z.infer<typeof addCommentFormSchema>
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

  const { error, data } = await supabase.from("comments").insert({
    content: values.content,
    post: values.postId,
  });

  if (error) return { error: error.message };
  return { success: "comment added" };
};
