import FeedNav from "@/components/shared/nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { unstable_noStore } from "next/cache";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  unstable_noStore();
  return (
    <main className="w-full h-[100dvh] flex flex-col ">
      <FeedNav />
      <ScrollArea className="max-h-full h-full w-full relative">
        {children}
      </ScrollArea>
    </main>
  );
}
