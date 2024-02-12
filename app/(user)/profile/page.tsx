"use client";
import { getFriendships } from "@/actions/user/get-friends";
import UserFriendshipCard from "@/components/cards/user-friendship-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/actions/user/get";
import { Loader2 } from "lucide-react";

export default function Profile() {
  // * gets current user's data from cookies and db
  const { data: userData, isFetching: userDataLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { cookieData, dbData } = await getUser();
      return { cookieData, dbData };
    },
  });

  const { data: friendships, isPending } = useQuery({
    queryKey: ["friendships"],
    queryFn: async () => {
      const { success } = await getFriendships();
      return success;
    },
  });

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
    (friendshipData) =>
      friendshipData.requester === userData?.cookieData?.user?.id
  );

  //? gets only the requests received by the current user
  const friendshipReqReceive = friendshipReqs?.filter(
    (friend) => friend.receiver === userData?.cookieData?.user?.id
  );
  if (userDataLoading)
    return (
      <main className="system-padding space-y-4">
        <Loader2 className="text-muted-foreground animate-spin" />
      </main>
    );
  return (
    <main className="system-padding space-y-4">
      <div>
        <p className="text-2xl font-bold text-primary">
          {userData?.dbData?.username}
        </p>
        <p className="text-xs text-muted-foreground">
          Member since{" "}
          {String(
            new Date(
              userData?.dbData?.created_at as string
            ).toLocaleDateString()
          )}
        </p>
      </div>
      {isPending ? (
        <div className="w-full min space-y-4">
          <Skeleton className="w-full min-h-8" />
          <Skeleton className="w-full min-h-[400px]" />
        </div>
      ) : (
        <Tabs defaultValue="friends" className="w-full ">
          <TabsList className="w-full">
            <TabsTrigger value="friends" className="flex-1">
              Friends ({acceptedFriendships?.length})
            </TabsTrigger>
            <TabsTrigger value="received" className="flex-1">
              Received ({friendshipReqReceive?.length})
            </TabsTrigger>
            <TabsTrigger value="requested" className="flex-1">
              Requested ({friendshipReqSent?.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="friends">
            <Card className="modified-card min-h-[400px]">
              <CardHeader className="space-y-4">
                {acceptedFriendships?.length ? (
                  acceptedFriendships?.map((friendshipData) => {
                    return (
                      <UserFriendshipCard
                        key={friendshipData.id}
                        friendship={friendshipData}
                        type="friends"
                      />
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center">
                    You have no friends yet.
                  </p>
                )}
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="received">
            <Card className="modified-card min-h-[400px]">
              <CardHeader className="space-y-4">
                {friendshipReqReceive?.length ? (
                  friendshipReqReceive?.map((friendship) => {
                    return (
                      <UserFriendshipCard
                        key={friendship.id}
                        friendship={friendship}
                        type="received"
                      />
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center">
                    Not even a single donkey wants to befriend you.
                  </p>
                )}
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="requested">
            <Card className="modified-card min-h-[400px]">
              <CardHeader className="space-y-4">
                {friendshipReqSent?.length ? (
                  friendshipReqSent?.map((friendship) => {
                    return (
                      <UserFriendshipCard
                        key={friendship.id}
                        friendship={friendship}
                        type="sent"
                      />
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center">
                    Don&apos;t.
                  </p>
                )}
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
