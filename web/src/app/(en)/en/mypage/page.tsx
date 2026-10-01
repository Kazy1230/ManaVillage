import type { Metadata } from "next";
import MyPageView from "@/components/pages/MyPageView";

export const metadata: Metadata = { title: "My page" };

export default function Page() {
  return <MyPageView lang="en" />;
}
