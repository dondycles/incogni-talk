"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptimisticPost, useUserData } from "@/store";
import { sharedPost as share } from "@/actions/post/share";
import { useState } from "react";
import SharedPostCard from "../cards/shared-post-card";
import { ScrollArea } from "../ui/scroll-area";

const formSchema = z.object({
  content: z.string(),
  privacy: z.string(),
  post_id: z.string(),
});

export function SharePostForm({
  close,
  postId,
  openForm,
  setOpenForm,
}: {
  close: () => void;
  openForm: boolean;
  postId: string;
  setOpenForm: () => void;
}) {
  const optimisticPost = useOptimisticPost();
  const queryClient = useQueryClient();
  const {
    mutate: sharePost,
    variables,
    isPending,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => onSubmit(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      privacy: "public",
      post_id: postId,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    optimisticPost.setData(variables);
    const { error } = await share(values);
    if (error) return form.setError("content", { message: error });
    optimisticPost.setData(null);
    form.reset();
    setOpenForm();
  }

  return (
    <Dialog onOpenChange={setOpenForm} open={openForm}>
      <DialogTrigger hidden className="pointer-events-none" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this post?</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values: z.infer<typeof formSchema>) =>
              sharePost(values)
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
                      rows={2}
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
                {isPending ? "Sharing..." : "Share"}
              </Button>
            </div>
          </form>
        </Form>
        <ScrollArea className="max-h-[300px]">
          <SharedPostCard sharedPostId={postId} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
