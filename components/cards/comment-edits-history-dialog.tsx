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

export default function CommentEditsHistoryDialog({
  data,
  children,
}: {
  data: any;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comments Edit History</DialogTitle>
          <ScrollArea>
            <div className="space-y-2 mt-4 max-h-[300px]">
              {data?.flatMap((history: any) => {
                return (
                  <div
                    key={history.id}
                    className="bg-secondary p-2 rounded-[0.5rem]"
                  >
                    {history?.data &&
                      Array.isArray(history.data) && // Check if history.data exists and is an array
                      (history.data.length > 0 ? ( // Check if it has at least one element
                        <div>
                          <p className="w-full whitespace-pre">
                            {(history.data[0] as any).content}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {getTimeDiff(history.created_at)} ago
                          </p>
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
