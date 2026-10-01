import type { Metadata } from "next";
import { SignupView } from "@/components/pages/AuthViews";

export const metadata: Metadata = { title: "新規登録" };

export default async function Page(props: PageProps<"/signup">) {
  return <SignupView lang="ja" sp={await props.searchParams} />;
}
