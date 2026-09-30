import Link from "next/link";

export default function AuthShell({
  title,
  sub,
  tab,
  next,
  children,
}: {
  title: string;
  sub: string;
  tab?: "login" | "signup";
  next?: string;
  children: React.ReactNode;
}) {
  const q = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
  return (
    <div className="screen">
      <div className="wrap auth-wrap">
        <div className="panel auth intro">
          <div className="auth-head"><h1>{title}</h1><p className="sub">{sub}</p></div>
          {tab && (
            <nav className="tabs" aria-label="ログインと新規登録">
              <Link href={`/login${q}`} aria-current={tab === "login" ? "page" : undefined}>ログイン</Link>
              <Link href={`/signup${q}`} aria-current={tab === "signup" ? "page" : undefined}>新規登録</Link>
            </nav>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
