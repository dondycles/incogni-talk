import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { addFriend } from "@/actions/user/add-friend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserData } from "@/store";
import { getFriends } from "@/actions/user/get-friends";

export default function UserHoverCard({
  hoveredUser,
  children,
}: {
  hoveredUser: Users;
  children?: React.ReactNode;
}) {
  const userData = useUserData();
  const queryClient = useQueryClient();
  const { data: friends } = useQuery({
    queryFn: async () => {
      const { success } = await getFriends();
      return success;
    },
    queryKey: ["friends", hoveredUser?.id],
    refetchOnMount: true,
  });
  // !! if users id is in the friend field, the user is the request receiver
  const receivedFriends = friends?.filter(
    (friend) => friend.friend === userData.id
  );
  // !! else, the user is the sender of the request
  const requestedFriends = friends?.filter(
    (friend) => friend.user === userData.id
  );

  const isHoveredUserFromReceivedFriends = receivedFriends?.filter(
    (friend) => friend.user === hoveredUser?.id
  );

  const isHoveredUserFromRequestedFriends = requestedFriends?.filter(
    (friend) => friend.friend === hoveredUser?.id
  );

  // !! this list includes sent requests, received requests, and accepted friends
  const friendsList = friends?.filter(
    (friend) =>
      (friend.users?.id as string) === (hoveredUser?.id as string) ||
      (friend.users?.id as string) === (userData?.id as string)
  );

  const isRequested = Boolean(friendsList?.length);
  const isAccepted = Boolean(
    friendsList && friendsList[0] && friendsList[0].accepted
  );

  const unfriend = isRequested || isAccepted;

  const { mutate: _addFriend, isPending } = useMutation({
    mutationFn: () => addFriend(hoveredUser?.id as string, unfriend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", hoveredUser?.id] });
    },
  });

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        {children ? (
          children
        ) : (
          <a href={"/user/" + hoveredUser?.username}>{hoveredUser?.username}</a>
        )}
      </HoverCardTrigger>
      <HoverCardContent align="start" className="space-y-4">
        <div className="flex flex-row gap-2 items-center text-primary">
          <UserCircle className="big-icons " />
          <div>
            <p>
              <a href={"/user/" + hoveredUser?.username}>
                {hoveredUser?.username}
              </a>{" "}
            </p>
            <p className="font-normal text-muted-foreground text-xs">
              Member since{" "}
              {new Date(hoveredUser?.created_at as string).toLocaleDateString()}
            </p>
          </div>
        </div>
        {userData.id ===
        hoveredUser?.id ? null : !isHoveredUserFromReceivedFriends?.length &&
          !isHoveredUserFromRequestedFriends?.length ? (
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
        ) : (
          <>
            {isHoveredUserFromReceivedFriends?.length
              ? isHoveredUserFromReceivedFriends[0].accepted
                ? "Friend"
                : "Request Received"
              : null}

            {isHoveredUserFromRequestedFriends?.length
              ? isHoveredUserFromRequestedFriends[0].accepted
                ? "Friend"
                : "Requested"
              : null}
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
