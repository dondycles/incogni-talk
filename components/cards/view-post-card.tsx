import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Globe, Lock, Pencil, Trash, UserCircle } from "lucide-react";
import { getTimeDiff } from "@/lib/getTimeDiff";
import PostActions from "../actions/post-interactions";
import PostCommentsScrollable from "../scrollables/post-comments-scrollable";
import { useQuery } from "@tanstack/react-query";
import { getAllCommentCounts } from "@/actions/comment/get-count";
import ViewPostCommentsScrollable from "../scrollables/view-post-comments-scrollable";
import PostOptions from "../actions/post-options";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import CardSkeleton from "./skeleton";

type IsPending = {
  type: "delete" | "edit" | null;
  variables: any[any] | null;
};

export default function ViewPostCard({ post, auth }: { post: any; auth: any }) {
  const [isPending, setIsPending] = useState<IsPending>({
    type: null,
    variables: null,
  });

  const timeDifference = getTimeDiff(post?.created_at as string);
  const privacy =
    post?.privacy === "private" ? (
      <Lock className="small-icons" />
    ) : (
      <Globe className="small-icons" />
    );

  const { data: commentsCount, isLoading: commentsCountLoading } = useQuery({
    queryKey: ["view-post-comments-count", post?.id],
    queryFn: async () => {
      const { count } = await getAllCommentCounts(post?.id);
      return count;
    },
  });
  const isDeletable = auth?.cookieData?.user?.id === post?.author;
  const isEditable = auth?.cookieData?.user?.id === post?.author;

  return (
    <Card
      className={`modified-card border-none sm:shadow-none flex-1  flex flex-col h-full ${
        isPending.type && "opacity-50"
      }`}
    >
      {!post?.id ? (
        <>
          <p className="text-center text-muted-foreground">
            This post is missing.
          </p>
          <CardSkeleton type="post" isView />
        </>
      ) : (
        <>
          <CardHeader className="flex flex-row items-start gap-2 ">
            <div className="flex-1 flex flex-row items-center gap-2">
              <UserCircle className="big-icons" />
              <div className="space-y-2">
                <CardTitle>{post?.users?.username}</CardTitle>
                <p className="flex text-muted-foreground text-xs space-x-1">
                  <span>{timeDifference}</span>
                  {privacy}
                </p>
              </div>
            </div>
            <PostOptions
              post={post}
              isDeletable={isDeletable}
              isEditable={isEditable}
              setPending={(variables, type) => {
                setIsPending({
                  variables: variables,
                  type: type,
                });
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4 ">
            <p className="whitespace-pre">{post?.content}</p>
            <PostActions
              user={auth}
              postId={post?.id}
              isView={true}
              commentsCount={commentsCount as number}
            />
          </CardContent>
          <CardFooter className=" flex-1 overflow-auto">
            <ViewPostCommentsScrollable
              commentsCount={commentsCount as number}
              postId={post?.id}
            />
          </CardFooter>
        </>
      )}
    </Card>
  );
}
