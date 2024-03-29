"use client";
import { ScrollArea } from "../ui/scroll-area";
import { AddCommentForm } from "../forms/add-comment";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllComments } from "@/actions/comment/get-all";
import { CommentCard } from "../cards/comment-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { LucideLoader2 } from "lucide-react";
import CardSkeleton from "../cards/skeleton";

export default function ViewPostCommentsScrollable({
  postId,
  commentsCount,
}: {
  postId: string;
  commentsCount: number;
}) {
  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["view-post-comments", postId],
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await getAllComments(postId, pageParam);
        return data;
      },
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialPageParam: 1,
    });

  const comments = data?.pages.flatMap((comment) => comment);

  const lastPost = useRef<HTMLDivElement>(null);

  const { ref: veryLastPost, entry } = useIntersection({
    root: lastPost.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry]);

  return (
    <div className="w-full max-h-full h-full flex flex-col gap-4 ">
      {commentsCount > 0 ? (
        <ScrollArea className="flex-1">
          <div className="flex-1 space-y-2">
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => (
                  <CardSkeleton key={i + "view-post-comments"} type="comment" />
                ))
              : comments?.map((comment, i) => {
                  if (comments.length === i + 1)
                    return (
                      <>
                        <CommentCard key={comment?.id} comment={comment} />
                        <div ref={veryLastPost} className="w-full" />
                      </>
                    );
                  return <CommentCard key={comment?.id} comment={comment} />;
                })}
          </div>
          {/* {commentsCount != comments?.length && (
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => fetchNextPage()}
              ref={veryLastPost}
              className="w-full"
            >
              Load More
            </Button>
          )} */}
        </ScrollArea>
      ) : null}

      <AddCommentForm postId={postId} />
    </div>
  );
}
