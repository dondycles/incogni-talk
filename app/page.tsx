import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VenetianMask } from "lucide-react";
export default function Home() {
  return (
    <main className="w-full system-padding h-[100dvh] flex items-center justify-center gap-4 flex-col">
      <div className="space-y-4">
        <div>
          <h1 className="text-6xl font-bold">incognitalk.</h1>
          <p>Revealing the words anonimously.</p>
        </div>
        <Button asChild>
          <Link href={"/sign-up"}>Get Started</Link>
        </Button>
      </div>
      <div className="-z-10 absolute top-0 left-0 w-full h-full opacity-5 grid grid-cols-3 grid-rows-3 overflow-hidden">
        <VenetianMask className="h-full w-full aspect-square -rotate-45  row-start-1 col-start-1 scale-[250%]" />
        <VenetianMask className="row-start-2 col-start-2 m-auto h-full w-full aspect-square -rotate-45 scale-[250%]" />
        <VenetianMask className=" row-start-3 col-start-3 m-auto h-full w-full aspect-square -rotate-45 scale-[250%]" />
      </div>
    </main>
  );
}
