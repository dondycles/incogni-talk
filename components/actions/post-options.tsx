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
import { hidePost } from "@/actions/post/hide";

export default function PostOptions({
  isEditable,
  isDeletable,
  post,
  setPending,
}: {
  isEditable: boolean;
  isDeletable: boolean;
  post: PostsTypes;
  setPending: (
    variables: any[any] | null,
    type: "edit" | "delete" | null
  ) => void;
}) {
  const queryClient = useQueryClient();
  const postId = post?.id as string;
  const [openEditForm, setOpenEditForm] = useState(false);
  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => await delPost(postId),
    onMutate: () => {
      setPending(null, "delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["shared-post", postId] });
    },
    onError: () => {
      setPending(null, null);
    },
  });

  const { mutate: _hidePost } = useMutation({
    mutationFn: async () => await hidePost(postId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["shared-post", postId] });
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
          <DropdownMenuItem onClick={() => _hidePost()}>Hide</DropdownMenuItem>
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
