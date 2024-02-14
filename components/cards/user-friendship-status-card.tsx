import { Loader2, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { addFriend } from "@/actions/user/add-friend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserData } from "@/store";
import { getFriendships } from "@/actions/user/get-friends";
import { acceptFriend } from "@/actions/user/accept-friend";

export default function UserFriendshipStatusCard({
  viewedUser,
}: {
  viewedUser: Users;
}) {
  const myData = useUserData();
  const queryClient = useQueryClient();

  // * get current user's friends
  const { data: friends, isFetching: friendsFetching } = useQuery({
    queryFn: async () => {
      const { success } = await getFriendships(viewedUser?.id as string);
      return success;
    },
    queryKey: ["hovered-user", viewedUser?.id],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // ? if current users id is in the friend field, the hovered user initiates the request
  const receivedFriends = friends?.filter(
    (friend) => friend.receiver === myData.id
  );
  // ? else, the user initiates the request
  const requestedFriends = friends?.filter(
    (friend) => friend.requester === myData.id
  );

  //? checks if the hovered user initiates request first
  const isHoveredUserFromReceivedFriends = receivedFriends?.filter(
    (friend) => friend.requester === viewedUser?.id
  );

  //? checks if the currnt user initiates request first
  const isHoveredUserFromRequestedFriends = requestedFriends?.filter(
    (friend) => friend.receiver === viewedUser?.id
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
        viewedUser?.id as string,
        getFriendData?.accepted as boolean,
        myData?.id as string
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hovered-user", viewedUser?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["friendships", myData?.id],
      });
    },
  });

  const { mutate: _acceptFriend, isPending: _acceptFriendPending } =
    useMutation({
      mutationFn: () =>
        acceptFriend(viewedUser?.id as string, myData?.id as string),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["hovered-user", viewedUser?.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["friendships", myData?.id],
        });
      },
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-2 items-center text-primary">
        <UserCircle className="big-icons " />
        <div>
          <p className="font-semibold">
            <a
              href={
                myData?.id === viewedUser?.id
                  ? "/profile"
                  : "/user/" + viewedUser?.username
              }
            >
              {viewedUser?.username}
            </a>
          </p>
          <p className="font-normal text-muted-foreground text-xs">
            Member since{" "}
            {new Date(viewedUser?.created_at as string).toLocaleDateString()}
          </p>
        </div>
      </div>
      {friendsFetching ? (
        <>
          <Loader2 className="animate-spin text-muted-foreground" />
        </>
      ) : myData.id === viewedUser?.id ? null : (
        <div className="space-x-4">
          {getFriendData?.accepted === true && (
            <>
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
            </>
          )}
          {getFriendData?.accepted === false && (
            <>
              {isHoveredUserFromReceivedFriends?.length ? (
                <>
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
                </>
              ) : null}
              {isHoveredUserFromRequestedFriends?.length ? (
                <>
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
                </>
              ) : null}
            </>
          )}
          {getFriendData?.accepted === undefined && (
            <>
              <Button
                disabled={_addFriendPending}
                className={`flex-1`}
                onClick={() => _addFriend()}
              >
                Add Friend
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
