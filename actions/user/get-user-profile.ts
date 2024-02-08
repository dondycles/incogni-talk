"use server";
import { Database } from "@/database.types";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export const getUserProfile = async () => {
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

  const { data: cookieData, error: cookieError } =
    await supabase.auth.getUser();
  console.log(cookieError);
  if (cookieError) return { error: cookieError.message };

  const { data: dbData, error: dbError } = await supabase
    .from("users")
    .select("*, users(*)")
    .eq("id", cookieData.user?.id)
    .single();
  console.log(dbError);

  if (dbError) return { error: dbError.message };

  return { cookieData, dbData };
};
