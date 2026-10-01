import type { Metadata } from "next";
import { SignupView } from "@/components/pages/AuthViews";

export const metadata: Metadata = { title: "Sign up" };

export default async function Page(props: PageProps<"/en/signup">) {
  return <SignupView lang="en" sp={await props.searchParams} />;
}
