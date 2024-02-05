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
import { delComment } from "@/actions/comment/delete";
import { EditCommentForm } from "../forms/edit-comment";

export default function CommentOptions({
  isEditable,
  isDeletable,
  comment,
  setPending,
}: {
  isEditable: boolean;
  isDeletable: boolean;
  comment: CommentsTypes;
  setPending: (
    variables: any[any] | null,
    type: "edit" | "delete" | null
  ) => void;
}) {
  const commentId = comment?.id as string;
  const queryClient = useQueryClient();
  const [openEditForm, setOpenEditForm] = useState(false);
  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => await delComment(commentId),
    onMutate: () => {
      setPending(null, "delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", comment?.post],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments-count", comment?.post],
      });
      queryClient.invalidateQueries({
        queryKey: ["view-post-comments", comment?.post],
      });
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
        <EditCommentForm
          setPending={(variables, type) => setPending(variables, type)}
          comment={comment}
          close={() => {
            setOpenEditForm(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
