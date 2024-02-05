import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Globe, Lock, UserCircle } from "lucide-react";
import { getTimeDiff } from "@/lib/getTimeDiff";
import PostActions from "../actions/post-interactions";
import PostCommentsScrollable from "../scrollables/post-comments-scrollable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCommentCounts } from "@/actions/comment/get-count";
import PostOptions from "../actions/post-options";
import { useEffect, useState } from "react";
import { getOnePost } from "@/actions/post/get-one";
import { supabaseClient } from "@/supabase/client";
import CardSkeleton from "./skeleton";
import { User } from "@supabase/supabase-js";

type IsPending = {
  type: "delete" | "edit" | null;
  variables: any[any] | null;
};

interface PostCard {
  postId: string;
  user: UserData;
}

export default function PostCard<T>({ postId, user }: PostCard) {
  const [isPending, setIsPending] = useState<IsPending>({
    type: null,
    variables: null,
  });

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await getOnePost(postId);
      return data;
    },
  });

  const timeDifference = getTimeDiff(post?.created_at as string);
  const privacy =
    post?.privacy === "private" ? (
      <Lock className="small-icons" />
    ) : (
      <Globe className="small-icons" />
    );

  const comments = post?.comments?.flatMap((comment) => comment);

  const { data: commentsCount } = useQuery({
    queryKey: ["comments-count", postId],
    queryFn: async () => {
      const { count } = await getAllCommentCounts(postId);
      return count;
    },
  });
  const likes = post?.likes;
  const likesCount = likes?.length;
  const isDeletable = user?.cookieData?.user?.id === post?.author;
  const isEditable = user?.cookieData?.user?.id === post?.author;

  if (isLoading) return <CardSkeleton type="post" />;
  return (
    <Card className={`modified-card ${isPending.type && "opacity-50"}`}>
      <CardHeader className="flex flex-row items-start gap-2">
        <div className="flex-1 flex flex-row items-center gap-2">
          <UserCircle className="big-icons text-primary" />
          <div className="space-y-2">
            <CardTitle className="text-primary">
              {post?.users?.username}
            </CardTitle>
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
          likes={likes}
          user={user}
          postId={postId}
          counts={{
            commentsCount: commentsCount as number,
            likesCount: likesCount as number,
          }}
        />
      </CardContent>
      <CardFooter>
        <PostCommentsScrollable
          user={user}
          comments={comments}
          commentsCount={commentsCount as number}
          postId={postId}
        />
      </CardFooter>
    </Card>
  );
}
