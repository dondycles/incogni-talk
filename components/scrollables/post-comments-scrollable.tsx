"use client";

import { ScrollArea } from "../ui/scroll-area";
import { AddCommentForm } from "../forms/add-comment";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllComments } from "@/actions/comment/get-all";
import { CommentCard } from "../cards/comment-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { getManyComments } from "@/actions/comment/get-many";
import CardSkeleton from "../cards/skeleton";

export default function PostCommentsScrollable({
  postId,
  commentsCount,
}: {
  postId: string;
  commentsCount: number;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const { data } = await getManyComments(postId);
      return data;
    },
  });

  const comments = data?.flatMap((comment) => comment);
  return (
    <div className="w-full space-y-4">
      {commentsCount > 0 ? (
        <ScrollArea>
          <div className="max-h-[300px] space-y-2">
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => (
                  <CardSkeleton type="comment" />
                ))
              : comments?.map((comment) => {
                  return <CommentCard key={comment?.id} comment={comment} />;
                })}
          </div>
        </ScrollArea>
      ) : null}

      <AddCommentForm postId={postId} />
      {commentsCount > 4 ? (
        <Button asChild variant={"ghost"} className="w-full">
          <Link href={"/post/" + postId}>View Post</Link>
        </Button>
      ) : null}
    </div>
  );
}
