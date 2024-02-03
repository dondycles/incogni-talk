"use client";
import { getOnePost } from "@/actions/post/get-one";
import { getUser } from "@/actions/user/get";
import ViewPostCard from "@/components/cards/view-post-card";
import { useQuery } from "@tanstack/react-query";

export default function ViewPost({ params }: { params: { id: string } }) {
  const { data, isFetching } = useQuery({
    queryFn: async () => {
      const { data } = await getOnePost(params.id);
      return data;
    },
    queryKey: ["post", params.id],
  });

  const { data: user, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { cookieData, dbData } = await getUser();
      return { cookieData, dbData };
    },
  });
  return (
    <div className="feed-padding w-full h-[calc(100dvh-71px)] flex ">
      {data && <ViewPostCard key={data?.id} post={data} auth={user} />}
    </div>
  );
}
