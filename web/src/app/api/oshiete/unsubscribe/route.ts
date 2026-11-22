// メールソフトの「配信停止」ボタン(List-Unsubscribe-Post のワンクリック)の受け口
import { stopMailByToken } from "@/lib/oshiete/mailStop";

export async function POST(request: Request) {
  const t = new URL(request.url).searchParams.get("t") ?? "";
  const ok = await stopMailByToken(t);
  return Response.json({ ok }, { status: ok ? 200 : 400 });
}
