import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stopMailByToken } from "@/lib/oshiete/mailStop";

export const metadata: Metadata = { title: "朝のメールを止める", robots: { index: false } };

async function stop(fd: FormData) {
  "use server";
  const ok = await stopMailByToken(String(fd.get("t") ?? ""));
  redirect(`/oshiete/mail-stop?done=${ok ? "1" : "0"}`);
}

// メールの「通知を止める」リンクの行き先。メールソフトがリンクを先読みしても止まらないように、ボタンを押して止める
export default async function Page(props: PageProps<"/oshiete/mail-stop">) {
  const sp = await props.searchParams;
  const t = typeof sp.t === "string" ? sp.t : "";
  const done = sp.done;
  return (
    <main className="page">
      <h1>おしえて英語の朝のメール</h1>
      {done === "1" ? (
        <div className="card">
          <p>朝のメールを止めました。また受け取りたくなったら、マイページから設定できます。</p>
          <Link href="/oshiete">おしえて英語へ</Link>
        </div>
      ) : done === "0" ? (
        <div className="card">
          <p>止められませんでした。リンクが古いかもしれません。ログインして、マイページから止めてください。</p>
          <Link href="/mypage">マイページへ</Link>
        </div>
      ) : (
        <form className="card" action={stop}>
          <p>毎朝7時の「新しい質問が届いています」のメールを止めますか？</p>
          <input type="hidden" name="t" value={t} />
          <button className="btn primary" type="submit">メールを止める</button>
        </form>
      )}
    </main>
  );
}
