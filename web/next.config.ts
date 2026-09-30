import type { NextConfig } from "next";

const CANONICAL_HOST = "manavillage.online";

const nextConfig: NextConfig = {
  // 記事の Markdown は実行時に読み込むため、サーバー関数に同梱する
  outputFileTracingIncludes: {
    "/**": ["./content/articles/**/*"],
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
