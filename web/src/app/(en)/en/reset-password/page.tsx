import type { Metadata } from "next";
import { ResetPasswordView } from "@/components/pages/AuthViews";

export const metadata: Metadata = { title: "Reset your password" };

export default function Page() {
  return <ResetPasswordView lang="en" />;
}
