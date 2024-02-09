"use client";

import { Home, Pencil, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import UserNavButton from "./user-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddPostForm } from "../forms/add-post";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user/get";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserData } from "@/store";

export default function FeedNav() {
  const [openDialog, setOpenDialog] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["user-nav"],
    queryFn: async () => {
      const { cookieData, dbData } = await getUser();
      return { cookieData, dbData };
    },
  });

  const _userData = useUserData();
  const userData = data;
  const pathname = usePathname();

  useEffect(() => {
    _userData.setData(
      userData?.dbData?.username,
      userData?.cookieData?.user.id,
      userData?.dbData?.created_at
    );
  }, [data]);

  return (
    <nav className="system-padding w-full flex items-center justify-between border-b-border border-b-solid border-b-[1px] h-[74px]">
      <a href={"/"} className="font-bold text-lg sm:text-2xl text-primary">
        incognitalk.
      </a>
      <div className="flex items-center gap-4">
        {pathname != "/profile" ? (
          <Dialog onOpenChange={setOpenDialog} open={openDialog}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"secondary"} size={"icon"}>
                  <Plus />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Create</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Pencil className="w-4 h-4 mr-2" />
                    Post
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
              </DialogHeader>
              <AddPostForm close={() => setOpenDialog(false)} />
            </DialogContent>
          </Dialog>
        ) : (
          <Button asChild size={"icon"} variant={"secondary"}>
            <a href="/feed">
              <Home className="small-icons" />
            </a>
          </Button>
        )}
        {isLoading ? (
          <Skeleton className="h-9 w-9 py-2 px-4"></Skeleton>
        ) : (
          <UserNavButton userData={userData} />
        )}
      </div>{" "}
    </nav>
  );
}
