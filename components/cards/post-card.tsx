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
import CardSkeleton from "./skeleton";
import { getAllPostsHistory } from "@/actions/post/get-history";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostEditsDialog from "./post-edits-history-dialog";
import SharedPostCard from "./shared-post-card";
import UserHoverCard from "./user-hover-card";

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

  const { data: postEditHistory, isLoading: postEditHistoryLoading } = useQuery(
    {
      queryKey: ["post-history", postId],
      queryFn: async () => {
        const { data } = await getAllPostsHistory(postId);
        return data;
      },
    }
  );

  const hasEditHistory = Boolean(postEditHistory?.length);

  if (isLoading) return <CardSkeleton type="post" />;
  return (
    <Card className={`modified-card ${isPending.type && "opacity-50"}`}>
      <CardHeader className="flex flex-row items-start gap-2">
        <div className="flex-1 flex flex-row items-center gap-2">
          <UserCircle className="big-icons text-primary" />
          <div className="space-y-2">
            <CardTitle className="text-primary">
              <UserHoverCard user={post?.users as Users} />
              <span className="text-muted-foreground font-normal">
                {" "}
                {post?.shared_post && "shared a "}{" "}
                <a className="text-primary" href={"/post/" + post?.shared_post}>
                  post
                </a>
              </span>
            </CardTitle>
            <p className="flex text-muted-foreground text-xs space-x-1">
              <span>{timeDifference}</span>
              {privacy}
              {hasEditHistory ? (
                <PostEditsDialog data={postEditHistory}>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="w-fit h-fit p-0 m-0"
                  >
                    Edited
                  </Button>
                </PostEditsDialog>
              ) : null}
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
        {post?.shared_post ? (
          <SharedPostCard user={user} sharedPostId={post?.shared_post} />
        ) : null}
        <PostActions
          likes={likes}
          user={user}
          post={post}
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
