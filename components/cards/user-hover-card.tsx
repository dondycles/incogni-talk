import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { User, User2, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { addFriend } from "@/actions/user/add-friend";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "@/store";

export default function UserHoverCard({
  user,
  children,
}: {
  user: Users;
  children?: React.ReactNode;
}) {
  const userData = useUserData();
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
        {userData.id === user?.id ? null : (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => addFriend(user?.id as string)}
            >
              Add Friend
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
