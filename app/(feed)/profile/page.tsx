"use client";
import { getUser } from "@/actions/user/get";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => await getUser(),
  });
  return (
    <main className="system-padding">
      <p className="text-2xl font-bold text-primary">{user?.dbData?.username}</p>
    </main>
  );
}
