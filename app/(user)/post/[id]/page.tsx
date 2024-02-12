"use client";
import { getOnePost } from "@/actions/post/get-one";
import CardSkeleton from "@/components/cards/skeleton";
import ViewPostCard from "@/components/cards/view-post-card";
import { useQuery } from "@tanstack/react-query";

export default function ViewPost({ params }: { params: { id: string } }) {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await getOnePost(params.id);
      return data;
    },
    queryKey: ["view-post", params.id],
  });

  return (
    <div className="feed-padding w-full h-[calc(100dvh-71px)] flex ">
      {isLoading ? (
        <CardSkeleton type="post" isView />
      ) : (
        <ViewPostCard key={data?.id} post={data} />
      )}
    </div>
  );
}
