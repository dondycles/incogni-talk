import { getUserDb } from "@/actions/user/get-user";
import { useQuery } from "@tanstack/react-query";
import { UserCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { useUserData } from "@/store";

export default function UserCard({
  id,
  data,
  type,
}: {
  id?: string;
  data?: FriendsTyps;
  type: "friends" | "received" | "sent";
}) {
  const userData = useUserData();
  const userId = userData.id;
  const { data: _friendData } = useQuery({
    queryKey: ["friend", data?.user],
    queryFn: async () => {
      const { success } = await getUserDb(data?.user as string);
      return success;
    },
  });
  switch (type) {
    case "friends":
      return (
        <div className="p-2 bg-muted rounded-[0.5rem] flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex gap-2 items-center font-semibold text-primary w-full text-xs">
            <UserCircle2 className="medium-icons" />
            {data?.friend === userId
              ? _friendData?.username
              : data?.users?.username}
          </div>
          <div className="flex flex-row gap-2 items-center w-full justify-end">
            <Button className="" variant={"outline"}>
              Delete
            </Button>
          </div>
        </div>
      );
      break;
    case "received":
      const { data: user } = useQuery({
        queryFn: async () => {
          const { success } = await getUserDb(id as string);
          return success;
        },
        queryKey: ["request", id],
      });
      return (
        <div className="p-2 bg-muted rounded-[0.5rem] flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex gap-2 items-center font-semibold text-primary w-full">
            <UserCircle2 className="medium-icons" />
            {user?.username}
          </div>
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
          <div className="flex gap-2 items-center font-semibold text-primary w-full">
            <UserCircle2 className="medium-icons" />
            {data?.users?.username}
          </div>
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
