import { Heart, MessageCircle, Reply, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { getLikes } from "@/actions/post/get-likes";
import { likePost } from "@/actions/post/like";

export default function PostActions({
  postId,
  commentsCount,
  user,
}: {
  postId: string;
  commentsCount: number;
  user: any;
}) {
  const queryClient = useQueryClient();
  const userId = user?.cookieData?.user?.id;

  const { data: likes } = useQuery({
    queryKey: ["post-likes", postId],
    queryFn: async () => {
      const { success, error } = await getLikes(postId);

      return success;
    },
  });

  const isLiked = likes?.filter((like) => like.liker === userId).length
    ? true
    : false;

  const { mutate: _likePost, isPending: _likePostPending } = useMutation({
    mutationFn: async () => {
      await likePost(postId, isLiked, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-likes", postId] });
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
        <p className="text-xs text-muted-foreground ml-1">{likes?.length}</p>
      </Button>
      <Button asChild variant={"secondary"} className="flex-1">
        <Link href={"/post/" + postId}>
          <MessageCircle className="small-icons" />
          <p className="text-xs text-muted-foreground ml-1">{commentsCount}</p>
        </Link>
      </Button>
      <Button variant={"secondary"} className="flex-1">
        <Share2 className="small-icons" />
      </Button>
    </div>
  );
}
