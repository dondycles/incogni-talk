import { getTimeDiff } from "@/lib/getTimeDiff";
import { User, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import CommentOptions from "../actions/comment-options";
import { useState } from "react";
import { Database, Tables } from "@/database.types";
import { getAllCommentsHistory } from "@/actions/comment/get-history";
import { useQuery } from "@tanstack/react-query";
import CommentEditsHistoryDialog from "./comment-edits-history-dialog";
import { useUserData } from "@/store";

export function CommentCard({ comment }: { comment: CommentsTypes }) {
  const userData = useUserData();
  const timeDifference = getTimeDiff(comment?.created_at as string);
  const userId = userData.id as string;

  const isDeletable =
    userId === comment?.commenter || userId === comment?.commenter;
  const isEditable = userId === comment?.commenter;

  const { data: commentEditHistory, isLoading: commentEditHistoryLoading } =
    useQuery({
      queryKey: ["comment-history", comment?.id],
      queryFn: async () => {
        const { data } = await getAllCommentsHistory(comment?.id);
        return data;
      },
    });

  const hasEditHistory = Boolean(commentEditHistory?.length);

  return (
    <div className="w-full flex flex-row gap-2 items-start">
      <UserCircle className="medium-icons" />
      <div className="w-full">
        <div className=" p-2 bg-muted rounded-[0.5rem] w-full flex flex-row items-start">
          <div className="flex-1">
            <p className="font-semibold">{comment?.users?.username}</p>
            <p className="whitespace-pre-line">{comment?.content}</p>
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
          {hasEditHistory ? (
            <CommentEditsHistoryDialog data={commentEditHistory}>
              <Button
                size={"sm"}
                variant={"ghost"}
                className="w-fit h-fit p-0 m-0 text-muted-foreground text-xs"
              >
                Edited
              </Button>
            </CommentEditsHistoryDialog>
          ) : null}
        </div>
      </div>
    </div>
  );
}
