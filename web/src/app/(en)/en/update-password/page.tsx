import type { Metadata } from "next";
import { UpdatePasswordView } from "@/components/pages/AuthViews";

export const metadata: Metadata = { title: "New password" };

export default function Page() {
  return <UpdatePasswordView lang="en" />;
}
