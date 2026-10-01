import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// どのルートにも当てはまらない URL の 404(ルートレイアウトが言語ごとに2つあるため、全体の 404 はここで出す)
export const metadata: Metadata = { title: "ページが見つかりません | まなビレッジ" };

export default function GlobalNotFound() {
  return (
    <html lang="ja">
      <body>
        <main className="screen">
          <div className="wrap auth-wrap">
            <div className="panel auth" style={{ textAlign: "center" }}>
              <p className="en" style={{ fontSize: 40, color: "var(--accent)" }}>Oops.</p>
              <h1 style={{ fontSize: 22 }}>ページが見つかりません</h1>
              <p className="sub">URLが間違っているか、ページが移動した可能性があります。<br /><span lang="en">Page not found.</span></p>
              <Link className="btn primary" href="/" style={{ justifySelf: "center" }}>トップへ戻る / Back to the top</Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
