"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { login } from "@/actions/auth/log-in";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Enter your username.",
  }),
  password: z.string().min(1, {
    message: "Enter your password.",
  }),
});

export function LogInForm() {
  const queryClient = useQueryClient();
  const route = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await login(values);

    if (error) return;
    queryClient.invalidateQueries({ queryKey: ["user-nav"] });
    queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    route.push("/feed");
  }

  return (
    <Card className="w-full mb-auto z-20">
      <CardHeader>
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>
          Enter your credentials to log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Log In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
