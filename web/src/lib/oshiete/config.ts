// おしえて英語の設定。差し替えるのはこのファイルだけでよいように、ここにまとめる

// 1日に届く質問の数(ログインした人)
export const DAILY = 3;
// ログインしなくても遊べる数(体験版。最初の1日の分)
export const TRIAL = 3;

// ヒント動画(YouTube の限定公開)の動画 ID。https://youtu.be/XXXXXXXXXXX の XXXXXXXXXXX の部分を入れる。
// 空のままなら、ヒントには解説文だけが出る
export const HINT_VIDEOS: Record<string, string> = {
  SV: "", // 文の形1 S V
  SVO: "", // 文の形2 S V O
  SVC: "", // 文の形3 S V C
  SVOO: "", // 文の形4 S V O O
  SVOC: "", // 文の形5 S V O C
  JITA: "", // 自動詞と他動詞
  GUN: "", // 群動詞
  JODO: "", // 助動詞
};

// AI 判定の回数の上限(1日あたり)。超えたら、言葉の簡易判定に切り替える
export const JUDGE_LIMITS = { ip: 120, anon: 40, user: 150 };
// レビューの回数の上限(1日・1IPあたり)
export const REVIEW_LIMIT_PER_IP = 10;

// 1日の区切り:日本時間の朝7時(朝のメールと、その日の3トークが届く時刻)。
// 日本時間から7時間引いた日付を「その日」とする
export function dayKey(at: Date = new Date()): string {
  return new Date(at.getTime() + (9 - 7) * 3600 * 1000).toISOString().slice(0, 10);
}
