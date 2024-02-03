"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const getUser = async () => {
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

  const { data: cookieData, error: cookieError } =
    await supabase.auth.getUser();
  if (cookieError) return { error: cookieError.message };

  const { data: dbData, error: dbError } = await supabase
    .from("users")
    .select("*")
    .eq("id", cookieData.user?.id)
    .single();
  if (dbError) return { error: dbError.message };

  return { cookieData, dbData };
};
