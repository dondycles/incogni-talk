import ViewPostComponent from "./component";

export default function ViewPost({ params }: { params: { id: string } }) {
  return <ViewPostComponent id={params.id} />;
}
