"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const signup = async (values: {
  cpassword: string;
  password: string;
  username: string;
}) => {
  if (values.cpassword != values.password)
    return { error: "Password did not match!" };

  const cookieStore = cookies();

  const supabase = createServerClient(
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

  const { error: authError, data: authData } = await supabase.auth.signUp({
    email: values.username + "@incognitalk.com",
    password: values.password,
  });
  if (authError) return { error: authError.message };

  const { error: dbError } = await supabase.from("users").insert({
    username: values.username,
  });
  if (dbError) return { error: dbError.message };

  return { success: authData };
};
