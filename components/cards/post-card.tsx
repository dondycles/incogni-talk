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
import { ScrollArea } from "../ui/scroll-area";
import { AddCommentForm } from "../forms/add-comment";
import { Button } from "../ui/button";
import Link from "next/link";
import { CommentCard } from "./comment-card";
import { getManyComments } from "@/actions/comment/get-many";
import PostOptions from "../actions/post-options";
import { useState } from "react";

type IsPending = {
  type: "delete" | "edit" | null;
  variables: any[any] | null;
};

export default function PostCard({
  post,
  auth,
}: {
  post: any[any];
  auth: any[any];
}) {
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

  const { data: commentsCount } = useQuery({
    queryKey: ["post-comments-count", post.id],
    queryFn: async () => {
      const { count } = await getAllCommentCounts(post.id);
      return count;
    },
  });

  const isDeletable = auth?.cookieData?.user?.id === post?.author;
  const isEditable = auth?.cookieData?.user?.id === post?.author;

  return (
    <Card className={`modified-card ${isPending.type && "opacity-50"}`}>
      <CardHeader className="flex flex-row items-start gap-2">
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
      <CardContent className="space-y-4">
        <p className="whitespace-pre">
          {isPending.type === "edit"
            ? isPending?.variables?.content
            : post?.content}
        </p>
        <PostActions
          user={auth}
          postId={post.id}
          commentsCount={commentsCount as number}
        />
      </CardContent>
      <CardFooter>
        <PostCommentsScrollable
          commentsCount={commentsCount as number}
          postId={post.id}
        />
      </CardFooter>
    </Card>
  );
}
