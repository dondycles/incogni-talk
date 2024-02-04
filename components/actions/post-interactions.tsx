import { Heart, MessageCircle, Reply, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { getLikes } from "@/actions/post/get-likes";
import { likePost } from "@/actions/post/like";

export default function PostInteractions({
  postId,
  counts,
  user,
  likes,
  isView,
}: {
  postId: string;
  counts: { commentsCount: number; likesCount: number };
  user: any;
  likes: any;
  isView?: boolean;
}) {
  const queryClient = useQueryClient();
  const userId = user?.cookieData?.user?.id;

  const isLiked = likes?.filter((like: any) => like.liker === userId).length
    ? true
    : false;

  const { mutate: _likePost, isPending: _likePostPending } = useMutation({
    mutationFn: async () => {
      await likePost(postId, isLiked, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["view-post", postId] });
    },
  });

  return (
    <div className="w-full flex gap-2">
      <Button
        onClick={() => _likePost()}
        variant={isLiked ? "default" : "secondary"}
        disabled={_likePostPending}
        className="flex-1"
      >
        <Heart className="small-icons" />
        <p className="text-xs  ml-1">{counts.likesCount}</p>
      </Button>
      {isView ? (
        <Button variant={"secondary"} className="flex-1">
          <MessageCircle className="small-icons" />
          <p className="text-xs  ml-1">{counts.commentsCount}</p>
        </Button>
      ) : (
        <Button asChild variant={"secondary"} className="flex-1">
          <Link prefetch={false} href={"/post/" + postId}>
            <MessageCircle className="small-icons" />
            <p className="text-xs  ml-1">{counts.commentsCount}</p>
          </Link>
        </Button>
      )}

      <Button variant={"secondary"} className="flex-1">
        <Share2 className="small-icons" />
      </Button>
    </div>
  );
}
