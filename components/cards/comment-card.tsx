import { getTimeDiff } from "@/lib/getTimeDiff";
import { User, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import CommentOptions from "../actions/comment-options";

export function CommentCard({
  comment,
  user,
}: {
  comment: any[any];
  user: any[any];
}) {
  const timeDifference = getTimeDiff(comment?.created_at as string);

  const isDeletable =
    user?.cookieData?.user?.id === comment?.commenter ||
    user?.cookieData?.user?.id === comment?.posts?.author;
  const isEditable = user?.cookieData?.user?.id === comment?.commenter;

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
