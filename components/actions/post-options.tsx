import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delPost } from "@/actions/post/delete";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { EditPostForm } from "../forms/edit-post";
import { useState } from "react";

export default function PostOptions({
  isEditable,
  isDeletable,
  post,
  setPending,
}: {
  isEditable: boolean;
  isDeletable: boolean;
  post: any[any];
  setPending: (
    variables: any[any] | null,
    type: "edit" | "delete" | null
  ) => void;
}) {
  const queryClient = useQueryClient();
  const [openEditForm, setOpenEditForm] = useState(false);
  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => await delPost(post?.id),
    onMutate: () => {
      setPending(null, "delete");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
    onError: () => {
      setPending(null, null);
    },
  });

  return (
    <Dialog onOpenChange={setOpenEditForm} open={openEditForm}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => deletePost()}
            disabled={!isDeletable}
          >
            Delete
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem disabled={!isEditable}>Edit</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem>Hide</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <EditPostForm
          setPending={(variables, type) => setPending(variables, type)}
          post={post}
          close={() => {
            setOpenEditForm(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
