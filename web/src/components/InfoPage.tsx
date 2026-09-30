import Link from "next/link";

export default function InfoPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="screen">
      <div className="wrap reader-grid">
        <article className="panel paper">
          <div className="crumb">
            <Link href="/">トップ</Link>
            <span>/</span>
            <span>{title}</span>
          </div>
          <h1>{title}</h1>
          {updated && <p className="sub" style={{ marginTop: -8, marginBottom: 32 }}>{updated}</p>}
          <div className="prose">{children}</div>
        </article>
      </div>
    </div>
  );
}
