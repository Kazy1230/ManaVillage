import type { Metadata } from "next";
import { LoginView } from "@/components/pages/AuthViews";

export const metadata: Metadata = { title: "Log in" };

export default async function Page(props: PageProps<"/en/login">) {
  return <LoginView lang="en" sp={await props.searchParams} />;
}
