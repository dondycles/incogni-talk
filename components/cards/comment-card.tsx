import { getTimeDiff } from "@/lib/getTimeDiff";
import { User, UserCircle } from "lucide-react";
import { Button } from "../ui/button";

export function CommentCard({ comment }: { comment: any }) {
  const timeDifference = getTimeDiff(comment?.created_at as string);
  return (
    <div className="w-full flex flex-row gap-2 ">
      <UserCircle className="medium-icons" />
      <div className="w-full">
        <div className=" p-2 bg-muted rounded-[0.5rem] w-full">
          <p className="font-semibold">{comment?.users?.username}</p>
          <p className="whitespace-pre">{comment?.content}</p>
        </div>
        <div className="space-x-2">
          <span className="text-xs text-muted-foreground">
            {timeDifference}
          </span>
          <Button variant={"ghost"} className="min-h-0 h-fit" size={"sm"}>
            Like
          </Button>
          <Button variant={"ghost"} className="min-h-0 h-fit" size={"sm"}>
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
