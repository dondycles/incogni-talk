"use client";

import { getUserAllPosts } from "@/actions/post/get-users-posts";
import { getThisUser } from "@/actions/user/get-this-user";
import { getThisUsersFriends } from "@/actions/user/get-this-users-friends";
import PostCard from "@/components/cards/post-card";
import UserFriendshipCard from "@/components/cards/user-friendship-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserData } from "@/store";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ViewUser({ params }: { params: { username: string } }) {
  const myData = useUserData();

  const username = params?.username as string;

  const router = useRouter();

  const { data: viewedUsersData, isFetching: viewedUsersDataLoading } =
    useQuery({
      queryKey: ["viewed-user", username],
      queryFn: async () => {
        const { userData } = await getThisUser(username);
        return userData;
      },
      enabled: username ? true : false,
    });

  const userId = viewedUsersData?.id as string;

  const { data: viewedUsersFriends, isFetching: viewedUsersFriendsLoading } =
    useQuery({
      queryKey: ["this-users-friends", userId],
      queryFn: async () => {
        const { friends } = await getThisUsersFriends(userId);
        return friends;
      },
      enabled: userId ? true : false,
    });

  const acceptedFriendships = viewedUsersFriends?.map((friend) => friend);

  const {
    data: thisUsersPosts,
    isFetching: thisUsersPostsFetching,
    fetchNextPage: fetchNextPublicPosts,
  } = useInfiniteQuery({
    queryKey: ["this-users-posts", userId],
    queryFn: async ({ pageParam }) => {
      const { data } = await getUserAllPosts(pageParam, userId);
      return data;
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialPageParam: 1,
    enabled: userId ? true : false,
  });

  const usersAllPosts = thisUsersPosts?.pages?.flatMap((post) => post);

  const lastPost = useRef<HTMLDivElement>(null);

  const { ref: veryLastPost, entry } = useIntersection({
    root: lastPost.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPublicPosts();
  }, [entry, fetchNextPublicPosts]);

  useEffect(() => {
    if (myData?.id === userId) return router.push("/profile");
  }, [viewedUsersData?.id]);

  if (viewedUsersDataLoading)
    return (
      <main className="system-padding space-y-4">
        <Loader2 className="text-muted-foreground animate-spin" />
      </main>
    );

  return (
    <main className="system-padding space-y-4 ">
      <div>
        <p className="text-2xl font-bold text-primary">
          {viewedUsersData?.username}
        </p>

        <p>{viewedUsersData?.bio}</p>
        <p className="text-xs text-muted-foreground">
          Member since{" "}
          {String(
            new Date(viewedUsersData?.created_at as string).toLocaleDateString()
          )}
        </p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="flex-1">
            Posts
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex-1">
            Friends ({acceptedFriendships?.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="space-y-4">
          {usersAllPosts?.map((post) => {
            return (
              <PostCard key={post?.id as string} postId={post?.id as string} />
            );
          })}
          <div ref={veryLastPost} className="w-full" />
        </TabsContent>
        <TabsContent value="friends">
          <Card className="modified-card min-h-[400px]">
            <CardHeader className="space-y-4">
              {acceptedFriendships?.length ? (
                acceptedFriendships?.map((friendshipData) => {
                  return (
                    <UserFriendshipCard
                      // * gets the viewed userdata
                      viewedUser={viewedUsersData}
                      key={friendshipData.id}
                      friendship={friendshipData}
                      type="other-profile-view"
                    />
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground text-center">
                  This user have no friends yet.
                </p>
              )}
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
