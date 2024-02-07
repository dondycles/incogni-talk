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

type IsPending = {
  type: "delete" | "edit" | null;
  variables: any[any] | null;
};

interface SharedPostCard {
  sharedPostId: string;
  user: UserData;
}

export default function SharedPostCard<T>({
  sharedPostId,
  user,
}: SharedPostCard) {
  const [isPending, setIsPending] = useState<IsPending>({
    type: null,
    variables: null,
  });

  const [viewComments, setViewComments] = useState(false);

  const { data: sharedPost, isLoading } = useQuery({
    queryKey: ["shared-post", sharedPostId],
    queryFn: async () => {
      const { data } = await getOnePost(sharedPostId);
      return data;
    },
  });

  const timeDifference = getTimeDiff(sharedPost?.created_at as string);
  const privacy =
    sharedPost?.privacy === "private" ? (
      <Lock className="small-icons" />
    ) : (
      <Globe className="small-icons" />
    );

  const comments = sharedPost?.comments?.flatMap((comment) => comment);

  const { data: commentsCount } = useQuery({
    queryKey: ["shared-post-comments-count", sharedPostId],
    queryFn: async () => {
      const { count } = await getAllCommentCounts(sharedPostId);
      return count;
    },
  });
  const likes = sharedPost?.likes;
  const likesCount = likes?.length;
  const isDeletable = user?.cookieData?.user?.id === sharedPost?.author;
  const isEditable = user?.cookieData?.user?.id === sharedPost?.author;

  const { data: postEditHistory, isLoading: postEditHistoryLoading } = useQuery(
    {
      queryKey: ["shared-post-history", sharedPostId],
      queryFn: async () => {
        const { data } = await getAllPostsHistory(sharedPostId);
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
              {sharedPost?.users?.username}
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
          post={sharedPost}
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
            : sharedPost?.content}
        </p>
        <PostActions
          likes={likes}
          user={user}
          post={sharedPost}
          counts={{
            commentsCount: commentsCount as number,
            likesCount: likesCount as number,
          }}
        />
      </CardContent>
      <CardFooter>
        {/* <PostCommentsScrollable
          user={user}
          comments={comments}
          commentsCount={commentsCount as number}
          postId={sharedPostId}
        /> */}
        <Button className="w-full" variant={"secondary"}>
          View post
        </Button>
      </CardFooter>
    </Card>
  );
}
