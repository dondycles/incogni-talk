import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Globe, Lock, UserCircle } from "lucide-react";
import { getTimeDiff } from "@/lib/getTimeDiff";
import PostActions from "../actions/post-actions";
import PostCommentsScrollable from "../scrollables/post-comments-scrollable";
import { useQuery } from "@tanstack/react-query";
import { getAllCommentCounts } from "@/actions/comment/get-count";
import PostOptions from "../actions/post-options";
import { useState } from "react";
import { getOnePost } from "@/actions/post/get-one";
import CardSkeleton from "./skeleton";
import { getAllPostsHistory } from "@/actions/post/get-history";
import { Button } from "../ui/button";

import PostEditsDialog from "./post-edits-history-dialog";
import SharedPostCard from "./shared-post-card";
import UserHoverCard from "./user-hover-card";
import { useUserData } from "@/store";

type ModifyPending = {
  type: "delete" | "edit" | null;
  variables: any[any] | null;
};

interface PostCard {
  postId: string;
}

export default function PostCard<T>({ postId }: PostCard) {
  const userData = useUserData();

  const { data: post, isPending: postDataPending } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await getOnePost(postId);
      return data;
    },
  });

  const timeDifference = getTimeDiff(post?.created_at as string);

  // * checks if the post is public or private
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
  const isDeletable = userData.id === post?.author;
  const isEditable = userData.id === post?.author;

  // * gets the edit history of the post
  const { data: postEditHistory } = useQuery({
    queryKey: ["post-history", postId],
    queryFn: async () => {
      const { data } = await getAllPostsHistory(postId);
      return data;
    },
  });

  // * checks if the post has been edited at least once
  const hasEditHistory = Boolean(postEditHistory?.length);

  // * this for optimistic update if the post is being edited
  const [isModifyPending, setIsModifyPending] = useState<ModifyPending>({
    type: null,
    variables: null,
  });

  if (postDataPending) return <CardSkeleton type="post" />;
  if (!post) return <CardSkeleton type="post" />;
  return (
    <Card className={`modified-card ${isModifyPending.type && "opacity-50"}`}>
      <CardHeader className="flex flex-row items-start gap-2">
        <div className="flex-1 flex flex-row items-center gap-2">
          <UserHoverCard hoveredUser={post?.users as Users}>
            <UserCircle className="big-icons text-primary" />
          </UserHoverCard>
          <div className="space-y-2">
            <CardTitle className="text-primary">
              <UserHoverCard hoveredUser={post?.users as Users} />
              {post?.shared_post ? (
                <span className="text-muted-foreground font-normal">
                  {post?.shared_post && " shared a "}
                  <a
                    className="text-primary"
                    href={"/post/" + post?.shared_post}
                  >
                    post
                  </a>
                </span>
              ) : null}
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
          setModifyPending={(variables, type) => {
            setIsModifyPending({
              variables: variables,
              type: type,
            });
          }}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre">
          {isModifyPending.type === "edit"
            ? isModifyPending?.variables?.content
            : post?.content}
        </p>
        {post?.shared_post ? (
          <SharedPostCard sharedPostId={post?.shared_post} />
        ) : null}
        <PostActions
          likes={likes}
          post={post}
          counts={{
            commentsCount: commentsCount as number,
            likesCount: likesCount as number,
          }}
        />
      </CardContent>
      <CardFooter>
        <PostCommentsScrollable
          comments={comments}
          commentsCount={commentsCount as number}
          postId={postId}
        />
      </CardFooter>
    </Card>
  );
}
