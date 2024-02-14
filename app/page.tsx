import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VenetianMask } from "lucide-react";
export default function Home() {
  return (
    <main className="w-full system-padding h-[100dvh] flex items-center justify-center gap-4 flex-col">
      <div className="space-y-4">
        <div>
          <h1 className="text-6xl font-bold text-primary">incognitalk.</h1>
          <p>Revealing the words anonimously.</p>
        </div>
        <Button asChild>
          <Link href={"/sign-up"}>Get Started</Link>
        </Button>
      </div>
      <div className="opacity-5 dark:opacity-10 dark:mix-blend-difference  z-10 absolute top-0 left-0 w-full h-full  grid grid-cols-3 grid-rows-3 overflow-hidden pointer-events-none">
        <VenetianMask className="h-full w-full aspect-square -rotate-45  row-start-1 col-start-1 scale-[250%] text-primary" />
        <VenetianMask className="row-start-2 col-start-2 m-auto h-full w-full aspect-square -rotate-45 scale-[250%] text-primary" />
        <VenetianMask className=" row-start-3 col-start-3 m-auto h-full w-full aspect-square -rotate-45 scale-[250%] text-primary" />
      </div>
    </main>
  );
}
