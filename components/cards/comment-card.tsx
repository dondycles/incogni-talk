import { getTimeDiff } from "@/lib/getTimeDiff";
import { User, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import CommentOptions from "../actions/comment-options";
import { useState } from "react";
import { Database, Tables } from "@/database.types";

export function CommentCard({
  comment,
  user,
}: {
  comment: CommentsTypes;
  user: UserData;
}) {
  const timeDifference = getTimeDiff(comment?.created_at as string);
  const userId = user?.cookieData?.user?.id as string;

  const isDeletable =
    userId === comment?.commenter || userId === comment?.commenter;
  const isEditable = userId === comment?.commenter;

  return (
    <div className="w-full flex flex-row gap-2 items-start">
      <UserCircle className="medium-icons" />
      <div className="w-full">
        <div className=" p-2 bg-muted rounded-[0.5rem] w-full flex flex-row items-start">
          <div className="flex-1">
            <p className="font-semibold">{comment?.users?.username}</p>
            <p className="whitespace-pre">{comment?.content}</p>
          </div>
          <CommentOptions
            isDeletable={isDeletable}
            isEditable={isEditable}
            comment={comment}
            setPending={() => {}}
          />
        </div>
        <div className="space-x-2">
          <span className="text-xs text-muted-foreground">
            {timeDifference}
          </span>
          {/* <Button variant={"ghost"} className="min-h-0 h-fit" size={"sm"}>
            Like
          </Button>
          <Button variant={"ghost"} className="min-h-0 h-fit" size={"sm"}>
            Comment
          </Button> */}
        </div>
      </div>
    </div>
  );
}
