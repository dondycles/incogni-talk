"use client";

import { getAllPosts } from "@/actions/post/get-all";
import PostCard from "@/components/cards/post-card";
import { useOptimisticPost } from "@/store";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getUser } from "@/actions/user/get";
import { useIntersection } from "@mantine/hooks";
import { LucideLoader2 } from "lucide-react";

export default function Feed() {
  const {
    data: publicPostsData,
    isFetching: publicPostsLoading,
    fetchNextPage: fetchNextPublicPosts,
    isFetchingNextPage: isFetchingNextPublicPosts,
  } = useInfiniteQuery({
    queryKey: ["feed-posts"],
    queryFn: async ({ pageParam }) => {
      const { data } = await getAllPosts(pageParam);
      return data;
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialPageParam: 1,
  });
  const publicPosts = publicPostsData?.pages.flatMap((page) => page);
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { cookieData, dbData } = await getUser();
      return { cookieData, dbData };
    },
  });

  const lastPost = useRef<HTMLDivElement>(null);

  const { ref: veryLastPost, entry } = useIntersection({
    root: lastPost.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPublicPosts();
  }, [entry, fetchNextPublicPosts]);

  return (
    <main className="feed-padding h-full w-full space-y-4">
      {publicPosts?.map((post) => {
        return (
          <PostCard user={user} postId={post?.id as string} key={post?.id} />
        );
      })}

      <div ref={veryLastPost} className="w-full" />
    </main>
  );
}
