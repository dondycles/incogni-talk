import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function CardSkeleton({
  isView,
  type,
}: {
  isView?: boolean;
  type: "comment" | "post";
}) {
  if (type === "comment")
    return (
      <div className="w-full flex items-start gap-2">
        <Skeleton className="medium-icons rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="w-full h-14" />
          <div className="flex gap-2">
            <Skeleton className="w-14 h-4" />
            <Skeleton className="w-14 h-4" />
            <Skeleton className="w-14 h-4" />
          </div>
        </div>
      </div>
    );
  if (type === "post")
    return (
      <Card
        className={`${
          isView && "sm:shadow-none border-none"
        } w-full modified-card`}
      >
        <CardHeader>
          <CardTitle className="flex flex-row gap-2">
            <Skeleton className="big-icons rounded-full" />
            <div className="flex gap-2 flex-col">
              <Skeleton className="w-24 h-4 " />
              <Skeleton className="w-10 h-4 " />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="w-full h-20" />
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="flex-1 h-10" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i + "skeleton-comments"}
              className="w-full flex items-start gap-2"
            >
              <Skeleton className="medium-icons rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="w-full h-14" />
                <div className="flex gap-2">
                  <Skeleton className="w-14 h-4" />
                  <Skeleton className="w-14 h-4" />
                  <Skeleton className="w-14 h-4" />
                </div>
              </div>
            </div>
          ))}
          <Skeleton className="w-full h-14 mt-2" />
        </CardFooter>
      </Card>
    );
}
