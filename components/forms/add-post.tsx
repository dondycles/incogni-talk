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
import { useState } from "react";
import { useOptimisticPost } from "@/store";

export const addPostFormSchema = z.object({
  content: z.string().min(1, {
    message: "A message cannot be empty.",
  }),
  privacy: z.string(),
});

export function AddPostForm({ close }: { close: () => void }) {
  const optimisticPost = useOptimisticPost();
  const queryClient = useQueryClient();
  const {
    mutate: addPost,
    variables,
    isPending,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof addPostFormSchema>) =>
      onSubmit(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });

  const form = useForm<z.infer<typeof addPostFormSchema>>({
    resolver: zodResolver(addPostFormSchema),
    defaultValues: {
      content: "",
      privacy: "public",
    },
  });

  async function onSubmit(values: z.infer<typeof addPostFormSchema>) {
    optimisticPost.setData(variables);
    const { error } = await post(values);
    if (error) return form.setError("content", { message: error });
    optimisticPost.setData(null);
    form.reset();
    close();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values: z.infer<typeof addPostFormSchema>) => addPost(values)
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
