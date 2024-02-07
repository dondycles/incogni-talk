import { Heart, MessageCircle, Reply, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { likePost } from "@/actions/post/like";
import { useEffect, useState } from "react";
import { SharePostForm } from "../forms/share-post";

export default function PostInteractions({
  post,
  counts,
  user,
  likes,
  isView,
}: {
  post: PostsTypes;
  counts: { commentsCount: number; likesCount: number };
  user: UserData;
  likes: LikesTypes[] | undefined;
  isView?: boolean;
}) {
  const postId = post?.id as string;
  const queryClient = useQueryClient();
  const userId = user?.cookieData?.user.id as string;

  let isLiked = likes?.filter((like) => like?.liker === userId).length
    ? true
    : false;

  const { mutate: _likePost, isPending: _likePostPending } = useMutation({
    mutationFn: async () => {
      await likePost(postId, isLiked, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["shared-post", postId] });
      queryClient.invalidateQueries({ queryKey: ["view-post", postId] });
    },
  });

  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOptimisticLiked(isLiked);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isLiked]);

  return (
    <div className="w-full flex gap-2">
      <Button
        onClick={() => {
          if (_likePostPending) return;
          setOptimisticLiked((prev) => !prev);
          _likePost();
        }}
        variant={optimisticLiked ? "default" : "secondary"}
        disabled={_likePostPending}
        className="flex-1"
      >
        <Heart
          className={`small-icons ${isLiked && "fill-primary-foreground"}`}
        />
        <p className="text-xs  ml-1">{counts.likesCount}</p>
      </Button>
      {isView ? (
        <Button variant={"secondary"} className="flex-1">
          <MessageCircle className="small-icons" />
          <p className="text-xs  ml-1">{counts.commentsCount}</p>
        </Button>
      ) : (
        <Button asChild variant={"secondary"} className="flex-1">
          <a href={"/post/" + postId}>
            <MessageCircle className="small-icons" />
            <p className="text-xs  ml-1">{counts.commentsCount}</p>
          </a>
        </Button>
      )}
      <SharePostForm user={user} postId={postId} close={() => {}}>
        <Button variant={"secondary"} className="w-full">
          <Share2 className="small-icons" />
        </Button>
      </SharePostForm>
    </div>
  );
}
