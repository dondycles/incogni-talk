import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTimeDiff } from "@/lib/getTimeDiff";
import { ScrollArea } from "../ui/scroll-area";

export default function PostEditsHistoryDialog({
  data,
  children,
}: {
  data: PostsEditHistoryTypes[] | undefined | null;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post Edit History</DialogTitle>
          <ScrollArea>
            <div className="space-y-2 mt-4 max-h-[300px]">
              {data?.flatMap((history) => {
                return (
                  <div
                    key={history?.id}
                    className="bg-secondary p-2 rounded-[0.5rem]"
                  >
                    {history?.data &&
                      Array.isArray(history.data) && // Check if history.data exists and is an array
                      (history.data.length > 0 ? ( // Check if it has at least one element
                        <div>
                          <p className="w-full whitespace-pre">
                            {(history.data[0] as PostsTypes)?.content}
                          </p>
                          <div className="text-muted-foreground text-xs">
                            <p>{(history.data[0] as PostsTypes)?.privacy}</p>
                            <p>{getTimeDiff(history.created_at)} ago</p>
                          </div>
                        </div>
                      ) : (
                        // Render content, with optional chaining
                        <p>No content available</p> // Render a message if no content is available
                      ))}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
