// app/protected/dreams/[id]/edit/page.tsx
import EditDream from "./edit-dream";

export default function Page({ params }: { params: { id: string } }) {
  return <EditDream params={params} />;
}
