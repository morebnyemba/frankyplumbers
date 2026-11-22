import Link from "next/link";
import { PageHeader } from "@/components/sections";

export default function NotFound() {
  return (
    <PageHeader
      title="Page not found"
      crumb="404"
      actions={<Link className="btn btn-primary" href="/">Back to home</Link>}
    >
      That pipe leads nowhere. The page you&apos;re after may have moved.
    </PageHeader>
  );
}
