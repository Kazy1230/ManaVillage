import type { NextConfig } from "next";

const CANONICAL_HOST = "manavillage.online";

const nextConfig: NextConfig = {
  // ルートレイアウトが言語ごとに2つ((ja) と (en))あるため、全体の 404 は app/global-not-found.tsx で出す
  experimental: { globalNotFound: true },
  // 記事の Markdown は実行時に読み込むため、サーバー関数に同梱する
  outputFileTracingIncludes: {
    "/**": ["./content/articles/**/*", "./content/japanese/**/*"],
  },
  // 別ホスト名でのアクセスは正規のドメインへ寄せる（検索評価の分散を防ぐ）
  async redirects() {
    return ["www.manavillage.online", "manavillage.vercel.app"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${CANONICAL_HOST}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
