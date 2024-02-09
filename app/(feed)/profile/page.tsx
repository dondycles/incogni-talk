"use client";
import { getFriendships } from "@/actions/user/get-friends";
import UserFriendshipCard from "@/components/cards/user-friendship-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/store";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const userData = useUserData();
  const { data: friendships } = useQuery({
    queryKey: ["friendships"],
    queryFn: async () => {
      const { success } = await getFriendships();
      return success;
    },
  });

  console.log(friendships);

  //? gets only the accepted friends regardless of who initiates the request
  const acceptedFriendships = friendships?.filter(
    (friendshipData) => friendshipData.accepted === true
  );

  //? gets only the reqeuest regardless of who sent the request
  const friendshipReqs = friendships?.filter(
    (friendshipData) => friendshipData.accepted === false
  );

  //? gets only the requests sent by the current user
  const friendshipReqSent = friendshipReqs?.filter(
    (friendshipData) => friendshipData.requester === userData.id
  );

  //? gets only the requests received by the current user
  const friendshipReqReceive = friendshipReqs?.filter(
    (friend) => friend.receiver === userData.id
  );

  return (
    <main className="system-padding space-y-4">
      <p className="text-2xl font-bold text-primary">{userData.username}</p>
      <Card className="modified-card">
        <CardHeader>
          <CardTitle>Friends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {acceptedFriendships?.map((friendshipData) => {
            return (
              <UserFriendshipCard
                key={friendshipData.id}
                friendship={friendshipData}
                type="friends"
              />
            );
          })}
        </CardContent>
      </Card>
      <Card className="modified-card">
        <CardHeader>
          <CardTitle>Friend Requests Sent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {friendshipReqSent?.map((friendship) => {
            return (
              <UserFriendshipCard
                key={friendship.id}
                friendship={friendship}
                type="sent"
              />
            );
          })}
        </CardContent>
      </Card>
      <Card className="modified-card">
        <CardHeader>
          <CardTitle>Friend Requests Received</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {friendshipReqReceive?.map((friendship) => {
            return (
              <UserFriendshipCard
                key={friendship.id}
                friendship={friendship}
                type="received"
              />
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
