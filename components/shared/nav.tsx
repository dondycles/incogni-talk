"use client";

import { Pencil, Plus } from "lucide-react";
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
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user/get";
import Link from "next/link";

export default function FeedNav() {
  const [openDialog, setOpenDialog] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["user-nav"],
    queryFn: async () => await getUser(),
    refetchOnWindowFocus: false,
  });

  const userData = data;

  return (
    <nav className="system-padding w-full flex items-center justify-between border-b-border border-b-solid border-b-[1px] h-[74px]">
      <Link href={"/"} className="font-bold text-lg sm:text-2xl">
        incognitalk.
      </Link>
      <div className="flex items-center gap-4">
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

        {isFetching ? (
          <Skeleton className="h-9 w-9 py-2 px-4"></Skeleton>
        ) : (
          <UserNavButton userData={userData} />
        )}
      </div>{" "}
    </nav>
  );
}
