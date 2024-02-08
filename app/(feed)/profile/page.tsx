"use client";
import { getUserProfile } from "@/actions/user/get-user-profile";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => await getUserProfile(),
  });

  const friends = user?.dbData?.users.flatMap((friend) => friend);
  console.log(friends);
  return (
    <main className="system-padding">
      <p className="text-2xl font-bold text-primary">
        {user?.dbData?.username}
      </p>
    </main>
  );
}
