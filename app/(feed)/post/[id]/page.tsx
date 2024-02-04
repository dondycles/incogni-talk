import { unstable_noStore } from "next/cache";
import ViewPostComponent from "./component";

export default async function ViewPost({ params }: { params: { id: string } }) {
  unstable_noStore();

  return <ViewPostComponent id={params.id} />;
}
