"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { addPost as post } from "@/actions/post/add";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "@/actions/post/edit";
import { editComment } from "@/actions/comment/edit";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "A message cannot be empty.",
  }),
  id: z.string(),
});

export function EditCommentForm({
  close,
  comment,
  setPending,
}: {
  close: () => void;
  comment: any[any];
  setPending: (
    variables: z.infer<typeof formSchema> | null,
    type: "edit" | null
  ) => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: _editPost, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => onSubmit(values),
    onMutate: (variables) => {
      setPending(variables, "edit");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", comment?.post] });
      queryClient.invalidateQueries({
        queryKey: ["view-post-comments", comment?.post],
      });
      setPending(null, null);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: comment?.content,
      id: comment?.id,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await editComment(values);
    if (error) return form.setError("content", { message: error });
    form.reset();
    close();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: z.infer<typeof formSchema>) =>
          _editPost(values)
        )}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  autoFocus={true}
                  rows={4}
                  placeholder="What are your thoughts?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              form.reset();
              close();
            }}
            className="w-fit"
            variant="outline"
          >
            Discard
          </Button>
          <Button className="w-fit" type="submit" disabled={isPending}>
            {isPending ? "Editing..." : "Edit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
