"use server";
import { editProfileFormSchema } from "../../components/forms/edit-bio";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import * as z from "zod";
export const editProfile = async (
  values: z.infer<typeof editProfileFormSchema>
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

  const { data } = await supabase.auth.getUser();
  const email = data?.user?.new_email
    ? data?.user?.new_email
    : data?.user?.email;

  if (email !== `${values.username}@incognitalk.com`) {
    const { error: cookieError } = await supabase.auth.updateUser({
      email: values.username + "@incognitalk.com",
    });
    if (cookieError) return { error: cookieError?.message };
  }

  const { error: dbError } = await supabase
    .from("users")
    .update({
      bio: values.bio,
      username: values.username,
    })
    .eq("id", values.userId);
  if (dbError) return { error: dbError.message };

  return { success: "bio updated!" };
};
