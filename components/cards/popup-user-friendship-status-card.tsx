import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUserData } from "@/store";
import UserFriendshipStatusCard from "./user-friendship-status-card";

export default function PopUpUserFriendshipStatusCard({
  hoveredUser,
  children,
}: {
  hoveredUser: Users;
  children?: React.ReactNode;
}) {
  const userData = useUserData();

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
        <UserFriendshipStatusCard viewedUser={hoveredUser} />
      </HoverCardContent>
    </HoverCard>
  );
}
