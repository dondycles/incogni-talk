"use client";
import { getFriendships } from "@/actions/user/get-friends";
import UserFriendshipCard from "@/components/cards/user-friendship-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/store";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/actions/user/get";
import { Edit, Loader2 } from "lucide-react";
import { getUserAllPosts } from "@/actions/post/get-users-posts";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import PostCard from "@/components/cards/post-card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { EditBioForm } from "@/components/forms/edit-bio";
import { Button } from "@/components/ui/button";

export default function Profile() {
  // * gets current user's data from cookies and db
  const { data: userData, isFetching: userDataLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { cookieData, dbData } = await getUser();
      return { cookieData, dbData };
    },
  });

  const { data: usersPosts, fetchNextPage: fetchNextPublicPosts } =
    useInfiniteQuery({
      queryKey: ["profile-posts", userData?.cookieData?.user?.id as string],
      queryFn: async ({ pageParam }) => {
        const { data } = await getUserAllPosts(
          pageParam,
          userData?.cookieData?.user?.id as string
        );
        return data;
      },
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialPageParam: 1,
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

  const usersAllPosts = usersPosts?.pages.flatMap((page) => page);

  const lastPost = useRef<HTMLDivElement>(null);

  const { ref: veryLastPost, entry } = useIntersection({
    root: lastPost.current,
    threshold: 1,
  });

  const [editBio, setEditBio] = useState(false);

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPublicPosts();
  }, [entry, fetchNextPublicPosts]);

  if (userDataLoading)
    return (
      <main className="system-padding space-y-4">
        <Loader2 className="text-muted-foreground animate-spin" />
      </main>
    );
  return (
    <main className="system-padding space-y-4 ">
      <div>
        <p className="text-2xl font-bold text-primary">
          {userData?.dbData?.username}
        </p>
        {editBio ? (
          <EditBioForm
            close={() => setEditBio(false)}
            user={userData?.dbData}
          />
        ) : (
          <>
            <p>{userData?.dbData?.bio}</p>
            <p className="text-xs text-muted-foreground">
              Member since{" "}
              {String(
                new Date(
                  userData?.dbData?.created_at as string
                ).toLocaleDateString()
              )}
            </p>
            <Button className="mt-2" onClick={() => setEditBio(true)}>
              Edit <Edit className="ml-1 small-icons" />
            </Button>
          </>
        )}
      </div>
      {isPending ? (
        <div className="w-full min space-y-4">
          <Skeleton className="w-full min-h-8" />
          <Skeleton className="w-full min-h-[400px]" />
        </div>
      ) : (
        <Tabs defaultValue="posts">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1">
              Posts
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex-1">
              Friends
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <ScrollArea className="space-y-4 max-h-fulll">
              {usersAllPosts?.map((post) => {
                return (
                  <PostCard
                    key={post?.id as string}
                    postId={post?.id as string}
                  />
                );
              })}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="friends">
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
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
