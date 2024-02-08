"use client";
import { getUserProfile } from "@/actions/user/get-user-profile";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { cookieData, dbData } = await getUserProfile();
      return { cookieData, dbData };
    },
  });

  const friends = user?.dbData?.users.flatMap((friend) => friend);
  return (
    <main className="system-padding">
      <p className="text-2xl font-bold text-primary">
        {user?.cookieData?.user.id}
      </p>
    </main>
  );
}
