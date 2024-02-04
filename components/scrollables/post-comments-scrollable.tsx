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
import { getAllCommentCounts } from "@/actions/comment/get-count";

export default function PostCommentsScrollable({
  postId,
  comments,
  user,
  commentsCount,
}: {
  postId: string;
  comments: any[any];
  user: any[any];
  commentsCount: number;
}) {
  return (
    <div className="w-full space-y-4">
      {commentsCount > 0 ? (
        <ScrollArea>
          <div className="max-h-[300px] space-y-2">
            {comments?.map((comment: any) => {
              return (
                <CommentCard user={user} key={comment?.id} comment={comment} />
              );
            })}
          </div>
        </ScrollArea>
      ) : null}

      <AddCommentForm postId={postId} />
      {commentsCount > 4 ? (
        <Button asChild variant={"ghost"} className="w-full">
          <link href={"/post/" + postId}>View Post</link>
        </Button>
      ) : null}
    </div>
  );
}
