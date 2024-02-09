import { getUserDb } from "@/actions/user/get-user";
import { useQuery } from "@tanstack/react-query";
import { UserCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { useUserData } from "@/store";
import UserHoverCard from "./user-hover-card";

export default function UserFriendshipCard({
  friendship,
  type,
}: {
  friendship?: FriendsTyps;
  type: "friends" | "received" | "sent";
}) {
  const userData = useUserData();
  const userId = userData.id;

  // ? data?.user is the receiver's user data

  //? gets the requester data if the user is the receiver
  const { data: _requesterData } = useQuery({
    queryKey: ["friend", friendship?.requester],
    queryFn: async () => {
      const { success } = await getUserDb(friendship?.requester as string);
      return success;
    },
  });

  switch (type) {
    case "friends":
      return (
        <div className="p-2 bg-muted rounded-[0.5rem] flex flex-col sm:flex-row items-start justify-between gap-4">
          <UserHoverCard
            hoveredUser={
              friendship?.receiver === userId
                ? _requesterData
                : friendship?.users
            }
          >
            <div className="flex gap-2 items-center font-semibold text-primary w-full text-xs">
              <UserCircle2 className="medium-icons" />
              {friendship?.receiver === userId
                ? _requesterData?.username
                : friendship?.users?.username}
            </div>
          </UserHoverCard>
          <div className="flex flex-row gap-2 items-center w-full justify-end">
            <Button className="" variant={"outline"}>
              Delete
            </Button>
          </div>
        </div>
      );
      break;
    case "received":
      return (
        <div className="p-2 bg-muted rounded-[0.5rem] flex flex-col sm:flex-row items-start justify-between gap-4">
          <UserHoverCard
            hoveredUser={
              friendship?.receiver === userId
                ? _requesterData
                : friendship?.users
            }
          >
            <div className="flex gap-2 items-center font-semibold text-primary w-full text-xs">
              <UserCircle2 className="medium-icons" />
              {friendship?.receiver === userId
                ? _requesterData?.username
                : friendship?.users?.username}
            </div>
          </UserHoverCard>
          <div className="flex flex-row gap-2 items-center w-full justify-end">
            <Button>Accept</Button>
            <Button className="" variant={"outline"}>
              Reject
            </Button>
          </div>
        </div>
      );
      break;
    case "sent":
      return (
        <div className="p-2 bg-muted rounded-[0.5rem] flex flex-col sm:flex-row items-start justify-between gap-4">
          <UserHoverCard
            hoveredUser={
              friendship?.receiver === userId
                ? _requesterData
                : friendship?.users
            }
          >
            <div className="flex gap-2 items-center font-semibold text-primary w-full text-xs">
              <UserCircle2 className="medium-icons" />
              {friendship?.receiver === userId
                ? _requesterData?.username
                : friendship?.users?.username}
            </div>
          </UserHoverCard>

          <div className="flex flex-row gap-2 items-center w-full justify-end">
            <Button className="" variant={"outline"}>
              Cancel
            </Button>
          </div>
        </div>
      );
      break;
  }
}
