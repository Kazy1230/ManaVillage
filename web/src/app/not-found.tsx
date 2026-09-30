import Link from "next/link";

export default function NotFound() {
  return (
    <div className="screen">
      <div className="wrap auth-wrap">
        <div className="panel auth intro" style={{ textAlign: "center" }}>
          <p className="en" style={{ fontSize: 40, color: "var(--accent)" }}>Oops.</p>
          <h1 style={{ fontSize: 22 }}>ページが見つかりません</h1>
          <p className="sub">URLが間違っているか、ページが移動した可能性があります。</p>
          <Link className="btn primary" href="/" style={{ justifySelf: "center" }}>トップへ戻る</Link>
        </div>
      </div>
    </div>
  );
}
