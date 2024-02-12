import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "@/actions/post/like";
import { useEffect, useState } from "react";
import { SharePostForm } from "../forms/share-post";
import { useUserData } from "@/store";

export default function PostInteractions({
  post,
  counts,
  likes,
  isView,
}: {
  post: PostsTypes;
  counts: { commentsCount: number; likesCount: number };
  likes: LikesTypes[] | undefined;
  isView?: boolean;
}) {
  const userData = useUserData();
  // * for the state of share post form
  const [openSharePostForm, setOpenSharePostForm] = useState(false);
  const postId = post?.id as string;
  const queryClient = useQueryClient();
  const userId = userData.id as string;

  //* checks if the current user's id is in the list of users who liked this current post
  let isLiked = likes?.filter((like) => like?.liker === userId).length
    ? true
    : false;

  const { mutate: _likePost, isPending: _likePostPending } = useMutation({
    mutationFn: async () => {
      await likePost(postId, isLiked, userId);
    },
    onSuccess: () => {
      // * refetches queries related to the liked or unliked post
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["shared-post", postId] });
      queryClient.invalidateQueries({ queryKey: ["view-post", postId] });
    },
  });

  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticLikePending, setOptimisticLikePending] = useState(false);

  useEffect(() => {
    // * makes sure that the optimisticLike is synchronized with the database
    // * executes after 1 second everytime the database changes to avoid spam
    const timeout = setTimeout(() => {
      setOptimisticLiked(isLiked);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isLiked]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOptimisticLikePending(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [optimisticLiked]);

  return (
    <div className="w-full flex gap-2">
      <Button
        onClick={() => {
          setOptimisticLikePending(true);
          // * returns if like or unlike mutation is pending
          if (optimisticLikePending) return;
          // * instantly changes the like button for optimistic purposes
          setOptimisticLiked((prev) => !prev);

          // * updates the database for the liked post
          _likePost();
        }}
        variant={optimisticLiked ? "default" : "secondary"}
        className="flex-1"
        size={"sm"}
      >
        <Heart
          className={`small-icons ${isLiked && "fill-primary-foreground"}`}
        />
        <p className="text-xs  ml-1">{counts.likesCount}</p>
      </Button>

      {isView ? (
        // * if is isView is true, the current page is in /post/[id]
        <Button variant={"secondary"} className="flex-1" size={"sm"}>
          <MessageCircle className="small-icons" />
          <p className="text-xs  ml-1">{counts.commentsCount}</p>
        </Button>
      ) : (
        // * if is isView is false, the current page is in /feed
        // * anchor tag is added to link its own post page /post/[id]
        <Button asChild size={"sm"} variant={"secondary"} className="flex-1">
          <a href={"/post/" + postId}>
            <MessageCircle className="small-icons" />
            <p className="text-xs  ml-1">{counts.commentsCount}</p>
          </a>
        </Button>
      )}
      <Button
        onClick={() => {
          // * opens the share post form below
          setOpenSharePostForm(true);
        }}
        size={"sm"}
        variant={"secondary"}
        className="flex-1 w-full"
      >
        <Share2 className="small-icons" />
      </Button>
      <SharePostForm
        openForm={openSharePostForm}
        // * toggles itself
        setOpenForm={() => setOpenSharePostForm((prev) => !prev)}
        postId={postId}
        close={() => setOpenSharePostForm(false)}
      />
    </div>
  );
}
