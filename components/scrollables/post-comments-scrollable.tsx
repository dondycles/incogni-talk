"use client";

import { ScrollArea } from "../ui/scroll-area";
import { AddCommentForm } from "../forms/add-comment";
import { CommentCard } from "../cards/comment-card";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
export default function PostCommentsScrollable({
  postId,
  comments,
  commentsCount,
}: {
  postId: string;
  comments: CommentsTypes[] | undefined;
  commentsCount: number;
}) {
  return (
    <div className="w-full space-y-4">
      {commentsCount > 0 ? (
        <ScrollArea>
          <div className="max-h-[300px] space-y-2">
            {comments?.map((comment) => {
              return <CommentCard key={comment?.id} comment={comment} />;
            })}
          </div>
        </ScrollArea>
      ) : null}
      {commentsCount > 4 ? (
        <Button
          asChild
          variant={"ghost"}
          className="w-full text-xs text-muted-foreground"
          size={"sm"}
        >
          <a href={"/post/" + postId}>
            View more comments <ExternalLink className="small-icons ml-1" />
          </a>
        </Button>
      ) : null}
      <AddCommentForm postId={postId} />
    </div>
  );
}
