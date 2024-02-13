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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { addPost as post } from "@/actions/post/add";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimisticPost } from "@/store";
import { editPost } from "@/actions/post/edit";
import { useRouter } from "next/navigation";

export const editPostFormSchema = z.object({
  content: z.string().min(1, {
    message: "A message cannot be empty.",
  }),
  privacy: z.string(),
  id: z.string(),
});

export function EditPostForm({
  close,
  post,
  setModifyPending,
}: {
  close: () => void;
  post: PostsTypes;
  setModifyPending: (
    variables: z.infer<typeof editPostFormSchema> | null,
    type: "edit" | null
  ) => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: _editPost, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof editPostFormSchema>) =>
      onSubmit(values),
    onMutate: (variables) => {
      setModifyPending(variables, "edit");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", post?.id] });
      queryClient.invalidateQueries({ queryKey: ["post-history", post?.id] });
      queryClient.invalidateQueries({ queryKey: ["view-post", post?.id] });
      setModifyPending(null, null);
    },
  });

  const form = useForm<z.infer<typeof editPostFormSchema>>({
    resolver: zodResolver(editPostFormSchema),
    defaultValues: {
      content: post?.content as string,
      privacy: post?.privacy as string,
      id: post?.id,
    },
  });

  async function onSubmit(values: z.infer<typeof editPostFormSchema>) {
    const { error } = await editPost(values);
    if (error) return form.setError("content", { message: error });
    form.reset();
    close();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values: z.infer<typeof editPostFormSchema>) => _editPost(values)
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
          <FormField
            control={form.control}
            name="privacy"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Public" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem value={"public"}>Public</SelectItem>
                    <SelectItem value={"private"}>Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
