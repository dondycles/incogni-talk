"use server";
import { sharePostFormSchema } from "@/components/forms/share-post";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import * as z from "zod";
export const sharedPost = async (
  values: z.infer<typeof sharePostFormSchema>
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

  const { error } = await supabase.from("posts").insert({
    content: values.content,
    privacy: values.privacy,
    shared_post: values.post_id,
  });

  if (error) return { error: error.message };
  return { success: "post added" };
};
