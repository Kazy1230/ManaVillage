import type { Metadata } from "next";
import { LoginView } from "@/components/pages/AuthViews";

export const metadata: Metadata = { title: "ログイン" };

export default async function Page(props: PageProps<"/login">) {
  return <LoginView lang="ja" sp={await props.searchParams} />;
}
