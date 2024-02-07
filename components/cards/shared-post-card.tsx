import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  ExternalLink,
  Globe,
  Heart,
  Lock,
  MessageCircle,
  UserCircle,
} from "lucide-react";
import { getTimeDiff } from "@/lib/getTimeDiff";
import PostActions from "../actions/post-interactions";
import { useQuery } from "@tanstack/react-query";
import { getAllCommentCounts } from "@/actions/comment/get-count";
import PostOptions from "../actions/post-options";
import { useState } from "react";
import CardSkeleton from "./skeleton";
import { getAllPostsHistory } from "@/actions/post/get-history";
import { Button } from "../ui/button";

import PostEditsDialog from "./post-edits-history-dialog";
import { getOneSharedPost } from "@/actions/post/get-one-shared-post";

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

  const {
    data: sharedPost,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shared-post", sharedPostId],
    queryFn: async () => {
      const { data } = await getOneSharedPost(sharedPostId);
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

  const { data: commentsCount } = useQuery({
    queryKey: ["shared-post-comments-count", sharedPostId],
    queryFn: async () => {
      const { count } = await getAllCommentCounts(sharedPostId);
      return count;
    },
  });
  const likes = sharedPost?.likes;
  const likesCount = likes?.length;
  let isLiked = sharedPost?.likes?.filter(
    (like) => like?.liker === user?.cookieData?.user.id
  ).length
    ? true
    : false;

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
  if (!sharedPost)
    return (
      <Card className={`modified-card `}>
        <CardHeader className="text-muted-foreground text-center">
          This post is either hidden by you or has been deleted.
        </CardHeader>
      </Card>
    );
  return (
    <Card className={`modified-card ${isPending.type && "opacity-50"}`}>
      <CardHeader className="flex flex-row items-start gap-2">
        <div className="flex-1 flex flex-row items-center gap-2">
          <UserCircle className="big-icons text-primary" />
          <div className="space-y-2">
            <CardTitle className="text-primary">
              {sharedPost?.users?.username}
              <span className="text-muted-foreground font-normal">
                {" "}
                {sharedPost?.shared_post && "shared a "}{" "}
                <a
                  className="text-primary"
                  href={"/post/" + sharedPost?.shared_post}
                >
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
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre">
          {isPending.type === "edit"
            ? isPending?.variables?.content
            : sharedPost?.content}
        </p>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart
              className={`small-icons ${
                isLiked && "fill-primary text-primary"
              }`}
            />
            {likesCount}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageCircle className="small-icons " />
            {commentsCount}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {/* <PostCommentsScrollable
          user={user}
          comments={comments}
          commentsCount={commentsCount as number}
          postId={sharedPostId}
        /> */}
        <Button
          asChild
          className="w-full text-xs text-muted-foreground"
          variant={"ghost"}
          size={"sm"}
        >
          <a href={"/post/" + sharedPostId}>
            View post <ExternalLink className="small-icons ml-1" />
          </a>
        </Button>
        {sharedPost?.shared_post && (
          <Button
            asChild
            className="w-full text-xs text-muted-foreground"
            variant={"ghost"}
            size={"sm"}
          >
            <a href={"/post/" + sharedPost?.shared_post}>
              View post&apos;s shared content{" "}
              <ExternalLink className="small-icons ml-1" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
