import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Globe, Lock, Pencil, Trash, UserCircle } from "lucide-react";
import { getTimeDiff } from "@/lib/getTimeDiff";
import PostActions from "../post/actions";
import PostCommentsScrollable from "../scrollables/post-comments-scrollable";
import { useQuery } from "@tanstack/react-query";
import { getAllCommentCounts } from "@/actions/comment/get-count";

export default function PostCard({ post, auth }: { post: any; auth: any }) {
  const timeDifference = getTimeDiff(post?.created_at as string);
  const privacy =
    post?.privacy === "private" ? (
      <Lock className="small-icons" />
    ) : (
      <Globe className="small-icons" />
    );

  const { data: commentsCount, isLoading: commentsCountLoading } = useQuery({
    queryKey: ["comments-count", post?.id],
    queryFn: async () => {
      const { count } = await getAllCommentCounts(post?.id);
      return count;
    },
  });

  return (
    <Card className="modified-card">
      <CardHeader className="flex flex-row items-center gap-2">
        <UserCircle className="big-icons" />
        <div className="space-y-2">
          <CardTitle>{post?.users?.username}</CardTitle>
          <p className="flex text-muted-foreground text-xs space-x-1">
            <span>{timeDifference}</span>
            {privacy}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre">{post?.content}</p>
        <PostActions
          user={auth}
          postId={post?.id}
          commentsCount={commentsCount as number}
        />
      </CardContent>
      <CardFooter>
        <PostCommentsScrollable
          postId={post?.id}
          commentsCount={commentsCount as number}
        />
      </CardFooter>
    </Card>
  );
}
