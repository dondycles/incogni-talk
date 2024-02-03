"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const editPost = async (values?: any) => {
  console.log(values);
  const cookieStore = cookies();

  const supabase = createServerClient(
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

  const { error } = await supabase
    .from("posts")
    .update({
      content: values.content,
      privacy: values.privacy,
    })
    .eq("id", values.id);

  if (error) return { error: error.message };
  return { success: "post added" };
};
