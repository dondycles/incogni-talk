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
  setModifyPending,
}: {
  isEditable: boolean;
  isDeletable: boolean;
  post: PostsTypes;
  setModifyPending: (
    variables: any[any] | null,
    type: "edit" | "delete" | null
  ) => void;
}) {
  const queryClient = useQueryClient();
  const postId = post?.id as string;
  // * for the state of edit form
  const [openEditFormDialog, setOpenEditFormDialog] = useState(false);
  const { mutate: deletePost } = useMutation({
    mutationFn: async () => await delPost(postId),
    onMutate: () => {
      setModifyPending(null, "delete");
    },
    onSuccess: () => {
      // * refetches queries related to the post after deletion
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["shared-post", postId] });
      queryClient.invalidateQueries({ queryKey: ["view-post", postId] });
    },
    onError: () => {
      setModifyPending(null, null);
    },
  });

  const { mutate: _hidePost } = useMutation({
    mutationFn: async () => await hidePost(postId),
    onSuccess: () => {
      // * refetches queries related to the post after hiding
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["shared-post", postId] });
    },
  });

  return (
    <Dialog onOpenChange={setOpenEditFormDialog} open={openEditFormDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => deletePost()}
            // * only the post's author can delete post
            disabled={!isDeletable}
          >
            Delete
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem
              // * only the post's author can edit post
              disabled={!isEditable}
            >
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={() => _hidePost()}>Hide</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <EditPostForm
          // * while edit is pending, sets the optimisticUpdate
          setModifyPending={(variables, type) =>
            setModifyPending(variables, type)
          }
          post={post}
          close={() => {
            setOpenEditFormDialog(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
