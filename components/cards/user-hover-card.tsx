import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Loader2, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { addFriend } from "@/actions/user/add-friend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserData } from "@/store";
import { getFriendships } from "@/actions/user/get-friends";
import { acceptFriend } from "@/actions/user/accept-friend";

export default function UserHoverCard({
  hoveredUser,
  children,
}: {
  hoveredUser: Users;
  children?: React.ReactNode;
}) {
  const userData = useUserData();
  const queryClient = useQueryClient();

  // * get current user's friends
  const { data: friends, isFetching: friendsFetching } = useQuery({
    queryFn: async () => {
      const { success } = await getFriendships(hoveredUser?.id as string);
      return success;
    },
    queryKey: ["hovered-user", hoveredUser?.id],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // ? if current users id is in the friend field, the hovered user initiates the request
  const receivedFriends = friends?.filter(
    (friend) => friend.receiver === userData.id
  );
  // ? else, the user initiates the request
  const requestedFriends = friends?.filter(
    (friend) => friend.requester === userData.id
  );

  //? checks if the hovered user initiates request first
  const isHoveredUserFromReceivedFriends = receivedFriends?.filter(
    (friend) => friend.requester === hoveredUser?.id
  );

  //? checks if the currnt user initiates request first
  const isHoveredUserFromRequestedFriends = requestedFriends?.filter(
    (friend) => friend.receiver === hoveredUser?.id
  );

  //! only one of them must be true

  const getFriendData = isHoveredUserFromReceivedFriends?.length
    ? isHoveredUserFromReceivedFriends[0]
    : null ||
      (isHoveredUserFromRequestedFriends?.length
        ? isHoveredUserFromRequestedFriends[0]
        : null);

  const { mutate: _addFriend, isPending: _addFriendPending } = useMutation({
    mutationFn: () =>
      addFriend(
        hoveredUser?.id as string,
        getFriendData?.accepted as boolean,
        userData?.id as string
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hovered-user", hoveredUser?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendships", userData?.id],
      });
    },
  });

  const { mutate: _acceptFriend, isPending: _acceptFriendPending } =
    useMutation({
      mutationFn: () =>
        acceptFriend(hoveredUser?.id as string, userData?.id as string),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["hovered-user", hoveredUser?.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["friendships", userData?.id],
        });
      },
    });

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        {children ? (
          children
        ) : (
          <a
            href={
              userData?.id === hoveredUser?.id
                ? "/profile"
                : "/user/" + hoveredUser?.username
            }
          >
            {hoveredUser?.username}
          </a>
        )}
      </HoverCardTrigger>
      <HoverCardContent align="start" className="space-y-4">
        <div className="flex flex-row gap-2 items-center text-primary">
          <UserCircle className="big-icons " />
          <div>
            <p>
              <a
                href={
                  userData?.id === hoveredUser?.id
                    ? "/profile"
                    : "/user/" + hoveredUser?.username
                }
              >
                {hoveredUser?.username}
              </a>
            </p>
            <p className="font-normal text-muted-foreground text-xs">
              Member since{" "}
              {new Date(hoveredUser?.created_at as string).toLocaleDateString()}
            </p>
          </div>
        </div>
        {friendsFetching ? (
          <>
            <Loader2 className="animate-spin text-muted-foreground" />
          </>
        ) : userData.id === hoveredUser?.id ? null : (
          <>
            {getFriendData?.accepted === true && (
              <div className="flex gap-2">
                <Button disabled variant={"outline"} className="flex-1">
                  Friend
                </Button>
                <Button
                  disabled={_addFriendPending}
                  className={`flex-1 }`}
                  onClick={() => _addFriend()}
                >
                  Unfriend
                </Button>
              </div>
            )}
            {getFriendData?.accepted === false && (
              <>
                {isHoveredUserFromReceivedFriends?.length ? (
                  <div className="flex gap-2">
                    <Button
                      disabled={_acceptFriendPending}
                      className={`flex-1 }`}
                      onClick={() => _acceptFriend()}
                    >
                      Accept
                    </Button>
                    <Button
                      disabled={_addFriendPending}
                      onClick={() => _addFriend()}
                      className="flex-1"
                      variant={"secondary"}
                    >
                      Delete
                    </Button>
                  </div>
                ) : null}
                {isHoveredUserFromRequestedFriends?.length ? (
                  <div className="flex gap-2">
                    <Button disabled variant={"outline"} className="flex-1">
                      Requested
                    </Button>
                    <Button
                      disabled={_addFriendPending}
                      className={`flex-1 }`}
                      onClick={() => _addFriend()}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : null}
              </>
            )}
            {getFriendData?.accepted === undefined && (
              <div className="flex gap-2">
                <Button
                  disabled={_addFriendPending}
                  className={`flex-1 }`}
                  onClick={() => _addFriend()}
                >
                  Add Friend
                </Button>
              </div>
            )}
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
