import { getUserDb } from "@/actions/user/get-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { useUserData } from "@/store";
import UserHoverCard from "./user-hover-card";
import { addFriend } from "@/actions/user/add-friend";
import { Card } from "../ui/card";
import { getTimeDiff } from "@/lib/getTimeDiff";
import { acceptFriend } from "@/actions/user/accept-friend";

export default function UserFriendshipCard({
  friendship,
  type,
}: {
  friendship?: FriendsTyps;
  type: "friends" | "received" | "sent";
}) {
  const queryClient = useQueryClient();
  const userData = useUserData();
  const userId = userData.id;

  //? gets the requester data incase the user is the receiver
  const { data: _requesterData } = useQuery({
    queryKey: ["friend", friendship?.requester],
    queryFn: async () => {
      const { success } = await getUserDb(friendship?.requester as string);
      return success;
    },
  });

  //? makes sure that the current user data is not getting used
  const whosData =
    friendship?.receiver === userId ? _requesterData : friendship?.users;

  const { mutate: _unfriend, isPending: unfriendPending } = useMutation({
    mutationFn: async () => {
      await addFriend(whosData?.id as string, true, userData?.id as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendships"] });
    },
  });

  const { mutate: _acceptFriend, isPending: acceptFriendPending } = useMutation(
    {
      mutationFn: async () => {
        await acceptFriend(whosData?.id as string, userData?.id as string);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["friendships"] });
      },
    }
  );

  return (
    <div className="flex sm:flex-row flex-col gap-2  border-b-[1px] border-b-border pb-2">
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
              Delete
            </Button>
          </div>
        </>
      )}
      {type === "sent" && (
        <>
          <UserData whosData={whosData} />
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
          <UserData whosData={whosData} />
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
    </div>
  );
}

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
              {friendship ? (
                <>
                  Friends since {getTimeDiff(friendship?.accepted_at as string)}
                </>
              ) : (
                <>Member since {getTimeDiff(whosData?.created_at as string)}</>
              )}
            </p>
          </div>
        </div>
      </UserHoverCard>
    </div>
  );
};
