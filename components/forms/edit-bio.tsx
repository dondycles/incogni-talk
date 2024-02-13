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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProfile } from "@/actions/user/edit-profile";
import { Input } from "../ui/input";

export const editProfileFormSchema = z.object({
  username: z.string(),
  bio: z.string(),
  userId: z.string(),
});

export function EditProfileForm({
  user,
  close,
}: {
  user: Users;
  close: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: _editProfile, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof editProfileFormSchema>) => {
      await onSubmit(values);
    },
  });

  const form = useForm<z.infer<typeof editProfileFormSchema>>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      username: user?.username as string,
      bio: user?.bio as string,
      userId: user?.id as string,
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileFormSchema>) {
    const { error } = await editProfile(values);
    if (error) {
      form.setError("username", { message: error });
      return { error: error };
    }
    form.reset();
    close();
    queryClient.invalidateQueries({ queryKey: ["user-nav"] });
    queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    return { success: "Done" };
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values: z.infer<typeof editProfileFormSchema>) =>
            _editProfile(values)
        )}
        className="flex flex-col gap-4 mt-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input autoFocus={true} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-fit space-x-4 ml-auto mr-0">
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
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
