import Link from "next/link";
import { lp } from "@/lib/paths";
import type { Lang } from "@/lib/sections";

export default function AuthShell({
  title,
  sub,
  tab,
  next,
  lang = "ja",
  children,
}: {
  title: string;
  sub: string;
  tab?: "login" | "signup";
  next?: string;
  lang?: Lang;
  children: React.ReactNode;
}) {
  const q = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
  const en = lang === "en";
  return (
    <div className="screen">
      <div className="wrap auth-wrap">
        <div className="panel auth intro">
          <div className="auth-head"><h1>{title}</h1><p className="sub">{sub}</p></div>
          {tab && (
            <nav className="tabs" aria-label={en ? "Log in or sign up" : "ログインと新規登録"}>
              <Link href={`${lp(lang, "/login")}${q}`} aria-current={tab === "login" ? "page" : undefined}>{en ? "Log in" : "ログイン"}</Link>
              <Link href={`${lp(lang, "/signup")}${q}`} aria-current={tab === "signup" ? "page" : undefined}>{en ? "Sign up" : "新規登録"}</Link>
            </nav>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
