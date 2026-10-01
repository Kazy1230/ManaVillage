import type { Metadata } from "next";
import { NewThreadView } from "@/components/pages/BoardViews";

export const metadata: Metadata = { title: "Start a thread" };

export default function Page() {
  return <NewThreadView lang="en" />;
}
