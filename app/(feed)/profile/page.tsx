"use client";
import { getFriends } from "@/actions/user/get-friends";
import { getUserDb } from "@/actions/user/get-user";
import UserCard from "@/components/cards/user-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Profile() {
  const userData = useUserData();
  const { data: friends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { success } = await getFriends();
      return success;
    },
  });

  const acceptedFriends = friends?.filter((friend) => friend.accepted === true);
  const friendReqs = friends?.filter((friend) => friend.accepted === false);
  const friendReqSent = friendReqs?.filter(
    (friend) => friend.friend != userData.id
  );
  const friendReqReceive = friendReqs?.filter(
    (friend) => friend.friend === userData.id
  );

  return (
    <main className="system-padding space-y-4">
      <p className="text-2xl font-bold text-primary">{userData.username}</p>
      <Card>
        <CardHeader>
          <CardTitle>Friends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {acceptedFriends?.map((friend) => {
            return <UserCard key={friend.id} data={friend} type="friends" />;
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Friend Requests Sent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {friendReqSent?.map((friend) => {
            return <UserCard key={friend.id} data={friend} type="sent" />;
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Friend Requests Received</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {friendReqReceive?.map((friend) => {
            return (
              <UserCard
                key={friend.id}
                id={friend.user as string}
                type="received"
              />
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
