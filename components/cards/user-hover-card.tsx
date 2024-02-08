import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { User, User2, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { addFriend } from "@/actions/user/add-friend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserData } from "@/store";
import { getFriends } from "@/actions/user/get-friends";

export default function UserHoverCard({
  user,
  children,
}: {
  user: Users;
  children?: React.ReactNode;
}) {
  const userData = useUserData();
  const queryClient = useQueryClient();
  const { data: friends } = useQuery({
    queryFn: async () => {
      const { success } = await getFriends();
      return success;
    },
    queryKey: ["friends", user?.id],
  });

  const friend = friends?.filter(
    (friend) => (friend.users?.id as string) === (user?.id as string)
  );

  const isRequested = Boolean(friend?.length);
  const isAccepted = friend && friend[0] && friend[0].accepted;

  const {
    mutate: _addFriend,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: () => addFriend(user?.id as string, isRequested),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", user?.id] });
    },
  });

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        {children ? (
          children
        ) : (
          <a href={"/user/" + user?.username}>{user?.username}</a>
        )}
      </HoverCardTrigger>
      <HoverCardContent align="start" className="space-y-4">
        <div className="flex flex-row gap-2 items-center text-primary">
          <UserCircle className="big-icons " />
          <div>
            <p>
              <a href={"/user/" + user?.username}>{user?.username}</a>{" "}
            </p>
            <p className="font-normal text-muted-foreground text-xs">
              Member since{" "}
              {new Date(user?.created_at as string).toLocaleDateString()}
            </p>
          </div>
        </div>
        {isAccepted ? (
          "Friend"
        ) : isRequested ? (
          <div className="flex gap-2">
            <Button className="w-full" disabled variant={"secondary"}>
              Request Sent
            </Button>
            <Button
              onClick={() => _addFriend()}
              className="flex-1"
              variant={"destructive"}
            >
              {isPending ? "Cancelling..." : "Cancel"}
            </Button>
          </div>
        ) : userData.id === user?.id ? null : (
          <div className="flex gap-2">
            <Button
              disabled={isPending}
              className={`flex-1 }`}
              onClick={() => _addFriend()}
            >
              {isPending ? "Adding..." : "Add Friend"}
            </Button>
            <Button className="flex-1" variant={"secondary"}>
              Block
            </Button>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
