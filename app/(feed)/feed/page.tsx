import { unstable_noStore } from "next/cache";
import FeedComponent from "./component";

export default async function Feed() {
  const response = await fetch("http://localhost:3000/api/getposts?page=1");
  const result = await response.json();
  console.log(result);
  return (
    <>
      <FeedComponent />
    </>
  );
}
