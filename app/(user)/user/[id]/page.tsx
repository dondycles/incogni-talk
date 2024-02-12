"use client";

export default function ViewUser({ params }: { params: { id: string } }) {
  return (
    <div className="feed-padding w-full h-[calc(100dvh-71px)] flex ">
      {params.id}
    </div>
  );
}
