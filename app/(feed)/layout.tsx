"use client";
import FeedNav from "@/components/shared/nav";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-[100dvh] flex flex-col ">
      <FeedNav />
      <ScrollArea className="max-h-full h-full w-full relative">
        {children}
      </ScrollArea>
    </main>
  );
}
