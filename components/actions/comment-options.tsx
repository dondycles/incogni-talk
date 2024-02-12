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

  const { mutate: deletePost } = useMutation({
    mutationFn: async () => await delComment(commentId),
    onMutate: () => {
      setPending(null, "delete");
    },
    onSuccess: () => {
      // * refetches the queries related to this comment after deletion
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
    //* a pop-up for comment's options such as the delete, edit
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
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <EditCommentForm
          // * if the edit is pending, the edit data is set for optimistic update
          setPending={(variables, type) => setPending(variables, type)}
          // * gets the comment data
          comment={comment}
          // * when discarding or the edit is successfull, the current pop-up will close
          close={() => {
            setOpenEditForm(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
