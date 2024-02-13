"use server";
import { addPostFormSchema } from "@/components/forms/add-post";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import * as z from "zod";
export const addPost = async (values: z.infer<typeof addPostFormSchema>) => {
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
  });

  if (error) return { error: error.message };
  return { success: "post added" };
};
