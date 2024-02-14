import { getUserDb } from "@/actions/user/get-user-db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { useUserData } from "@/store";
import UserHoverCard from "./popup-user-friendship-status-card";
import { addFriend } from "@/actions/user/add-friend";
import { Card } from "../ui/card";
import { getTimeDiff } from "@/lib/getTimeDiff";
import { acceptFriend } from "@/actions/user/accept-friend";
import { Skeleton } from "../ui/skeleton";

export default function UserFriendshipCard({
  viewedUser,
  friendship,
  type,
}: {
  friendship?: FriendsTyps;
  viewedUser: Users;
  type: "friends" | "received" | "sent" | "other-profile-view";
}) {
  const queryClient = useQueryClient();
  const userData = useUserData();
  const userId = userData.id;

  //? gets the requester data incase the current user or viewed user is the receiver
  // * applies both on current user and viewed user
  const { data: _requesterData, isFetching: _requesterDataFetching } = useQuery(
    {
      queryKey: ["friendship-requester", friendship?.requester],
      queryFn: async () => {
        const { success } = await getUserDb(friendship?.requester as string);
        return success;
      },
    }
  );

  //? makes sure that the current user data is not getting used
  //! does not apply with "other-profile-view" type
  const whosData =
    friendship?.receiver === userId ? _requesterData : friendship?.users;

  //! Only applies with "other-profile-view" type
  const viewedUsersFriend =
    friendship?.receiver === viewedUser?.id
      ? _requesterData
      : friendship?.users;

  const { mutate: _unfriend, isPending: unfriendPending } = useMutation({
    mutationFn: async () => {
      await addFriend(whosData?.id as string, true, userData?.id as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendships", userData?.id],
      });
    },
  });

  const { mutate: _acceptFriend, isPending: acceptFriendPending } = useMutation(
    {
      mutationFn: async () => {
        await acceptFriend(whosData?.id as string, userData?.id as string);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["friendships", userData?.id],
        });
      },
    }
  );

  return (
    <div className="flex sm:flex-row flex-col gap-2  border-b-[1px] border-b-border pb-2">
      {_requesterDataFetching ? (
        <LoadingData />
      ) : (
        <>
          {type === "friends" && (
            <>
              <UserData whosData={whosData} friendship={friendship} />
              <div className="flex flex-row gap-2 items-center w-full sm:w-fit justify-end">
                <Button
                  onClick={() => _unfriend()}
                  disabled={unfriendPending}
                  className=""
                  variant={"outline"}
                >
                  Unfriend
                </Button>
              </div>
            </>
          )}
          {type === "sent" && (
            <>
              <UserData whosData={whosData} friendship={friendship} />
              <div className="flex flex-row gap-2 items-center w-full sm:w-fit justify-end">
                <Button
                  onClick={() => _unfriend()}
                  disabled={unfriendPending}
                  className=""
                  variant={"outline"}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
          {type === "received" && (
            <>
              <UserData whosData={whosData} friendship={friendship} />
              <div className="flex flex-row gap-2 items-center w-full sm:w-fit justify-end">
                <Button
                  onClick={() => _acceptFriend()}
                  disabled={acceptFriendPending}
                >
                  Accept
                </Button>
                <Button
                  onClick={() => _unfriend()}
                  disabled={unfriendPending}
                  className=""
                  variant={"outline"}
                >
                  Reject
                </Button>
              </div>
            </>
          )}
          {type === "other-profile-view" && (
            <UserData whosData={viewedUsersFriend} friendship={friendship} />
          )}
        </>
      )}
    </div>
  );
}

const LoadingData = () => {
  return (
    <div className="flex-1 flex flex-row gap-4">
      <Skeleton className="big-icons rounded-full" />
      <div className="flex  flex-col justify-between">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
  );
};

const UserData = ({
  whosData,
  friendship,
}: {
  whosData: Users;
  friendship?: FriendsTyps;
}) => {
  return (
    <div className="flex-1">
      <UserHoverCard hoveredUser={whosData}>
        <div className="flex gap-2 items-start font-semibold text-primary w-full flex-1">
          <UserCircle2 className="big-icons" />
          <div className="flex-1 w-full">
            <p>{whosData?.username}</p>

            <p className="text-xs text-muted-foreground font-normal">
              {friendship?.accepted ? (
                <>
                  friended since{" "}
                  {getTimeDiff(friendship?.accepted_at as string)}
                </>
              ) : (
                <>
                  requested since{" "}
                  {getTimeDiff(friendship?.created_at as string)}
                </>
              )}
            </p>
          </div>
        </div>
      </UserHoverCard>
    </div>
  );
};
