import { SignUpForm } from "@/components/auth/sign-up";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="p-4 h-full w-full md:w-1/3 flex flex-col justify-center items-center">
      <div className="mt-0 mb-auto ml-auto mr-0 flex flex-row justify-between w-full md:w-fit">
        <Button className="md:hidden" asChild variant={"outline"}>
          <Link href={"/"}>Home</Link>
        </Button>
        <Button asChild>
          <Link href={"/log-in"}>Log In</Link>
        </Button>
      </div>
      <div className="w-fit md:max-w-[300px] mb-auto space-y-4">
        <div className="md:hidden">
          <h1 className="text-6xl font-bold">incognitalk.</h1>
          <p>Reaveling the words anonimously.</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
