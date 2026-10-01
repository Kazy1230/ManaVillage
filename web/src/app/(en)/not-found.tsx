import Link from "next/link";

export default function NotFound() {
  return (
    <div className="screen">
      <div className="wrap auth-wrap">
        <div className="panel auth intro" style={{ textAlign: "center" }}>
          <p className="en" style={{ fontSize: 40, color: "var(--accent)" }}>Oops.</p>
          <h1 style={{ fontSize: 22 }}>Page not found</h1>
          <p className="sub">The URL may be wrong, or the page may have moved.</p>
          <Link className="btn primary" href="/" style={{ justifySelf: "center" }}>Back to the top</Link>
        </div>
      </div>
    </div>
  );
}
