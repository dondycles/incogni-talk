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
import { useQuery } from "@tanstack/react-query";
import { getAllCommentCounts } from "@/actions/comment/get-count";
import ViewPostCommentsScrollable from "../scrollables/view-post-comments-scrollable";
import PostOptions from "../actions/post-options";
import { useEffect, useState } from "react";
import CardSkeleton from "./skeleton";
import UserHoverCard from "./popup-user-friendship-status-card";
import { useUserData } from "@/store";

type IsPending = {
  type: "delete" | "edit" | null;
  variables: any[any] | null;
};

export default function ViewPostCard({ post }: { post: PostsTypes }) {
  const userData = useUserData();
  const postId = post?.id as string;
  const postAuthor = post?.author as string;
  const userId = userData.id as string;
  const [modifyPending, setModifyPending] = useState<IsPending>({
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
    queryKey: ["comments-count", postId],
    queryFn: async () => {
      const { count } = await getAllCommentCounts(postId);
      return count;
    },
    staleTime: 1000,
  });

  const likes = post?.likes;
  const likesCount = likes?.length;
  const isDeletable = userId === postAuthor;
  const isEditable = userId === postAuthor;

  return (
    <Card
      className={`modified-card border-none sm:shadow-none flex-1  flex flex-col h-full ${
        modifyPending.type && "opacity-50"
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
              <UserHoverCard hoveredUser={post?.users}>
                <UserCircle className="big-icons text-primary" />
              </UserHoverCard>
              <div className="space-y-2 ">
                <CardTitle className="text-primary">
                  <UserHoverCard hoveredUser={post?.users} />
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
              setModifyPending={(variables, type) => {
                setModifyPending({
                  variables: variables,
                  type: type,
                });
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4 ">
            <p className="whitespace-pre-line">{post?.content}</p>
            <PostActions
              post={post}
              isView={true}
              likes={likes}
              counts={{
                likesCount: likesCount as number,
                commentsCount: commentsCount as number,
              }}
            />
          </CardContent>
          <CardFooter className=" flex-1 overflow-auto">
            <ViewPostCommentsScrollable
              commentsCount={commentsCount as number}
              postId={postId}
            />
          </CardFooter>
        </>
      )}
    </Card>
  );
}
