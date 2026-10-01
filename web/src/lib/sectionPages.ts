// 科目ごとのトップと、全体の入口(/)のカードの文言・見た目。
// 英語学習(/english)と日本語学習(/en/japanese)は専用のページ。それ以外の科目は components/SectionHome.tsx がこの設定で作る
import type { SectionKey } from "@/lib/sections";

export type PortalCard = { who: string; desc: string; count: (n: number) => string; btn: string; bg: string };

export type SectionPage = {
  // 見た目の上書き(globals.css の .section-<key>)
  theme: string;
  h1: string;
  intro: string;
  newSub: string;
  // 用語の帯: [用語, 短い説明]
  ticker: [string, string][];
  // ヒーローの右側の見出し
  stageLabel: string;
  boardText: string;
};

const ja = (n: number) => `記事 ${n}本`;

export const PORTAL_CARDS: Record<SectionKey, PortalCard> = {
  english: {
    who: "日本語で読む · FOR JAPANESE SPEAKERS",
    desc: "単語の覚え方、文法書の進め方、スピーキングの練習まで。研究と経験にもとづく英語の勉強法。",
    count: ja,
    btn: "英語の記事へ",
    bg: "var(--p1)",
  },
  japanese: {
    who: "IN ENGLISH · FOR JAPANESE LEARNERS",
    desc: "Practical guides to Japanese grammar and look-alike words — each one built around a simple analogy and real example sentences.",
    count: (n) => `${n} ${n === 1 ? "guide" : "guides"}`,
    btn: "Start learning",
    bg: "#F4EFE4",
  },
  it: { who: "日本語で読む · IT", desc: "Git、ネットワーク、データベース。ITの仕組みを、身近なたとえと図で解説します。", count: ja, btn: "ITの記事へ", bg: "#E3F4F1" },
  philosophy: { who: "日本語で読む · PHILOSOPHY", desc: "「なぜ？」を考える道具としての哲学。問いの立て方と、考え方の筋道を、身近な例で解説します。", count: ja, btn: "哲学の記事へ", bg: "#ECE8F6" },
  science: { who: "日本語で読む · SCIENCE", desc: "身のまわりの「どうして？」を、科学の考え方で。仮説と実験の進め方から、ニュースの読み方まで解説します。", count: ja, btn: "科学の記事へ", bg: "#E4EEF8" },
  relationships: { who: "日本語で読む · RELATIONSHIPS", desc: "聴き方、伝え方、距離のとり方。人との関わりで役に立つ考え方を、身近な場面で解説します。", count: ja, btn: "人間関係の記事へ", bg: "#FCE9E3" },
};

export const SECTION_PAGES: Partial<Record<SectionKey, SectionPage>> = {
  it: {
    theme: "section-it",
    h1: "ITの仕組みを、身近なたとえで。",
    intro: "Git、ネットワーク、データベース。むずかしそうな言葉も、身近なたとえと図で、仕組みから分かるように書いています。つまずいたら掲示板でみんなに聞けます。",
    newSub: "ITの仕組みを、たとえと図で解説する記事",
    ticker: [["commit", "変更を記録する"], ["branch", "作業の流れを分ける"], ["deploy", "本番に出す"], ["cache", "近くに置いて速くする"], ["API", "決まった窓口で頼む"], ["bug", "思った通りに動かない所"]],
    stageLabel: "$ この記事のキーワード",
    boardText: "エラーで止まったところを質問したり、学習の進み具合を報告したりできます。読むだけならログインは不要です。",
  },
  philosophy: {
    theme: "section-philosophy",
    h1: "「なぜ？」を、考える道具に。",
    intro: "哲学は、むずかしい言葉を覚える学問ではなく、考えるための道具です。問いの立て方や、考えの筋道を、身近な例で解説します。考えがまとまらないときは、掲示板でみんなと話せます。",
    newSub: "問いの立て方と、考え方の筋道を解説する記事",
    ticker: [["問い", "考えの出発点"], ["前提", "議論の土台にしていること"], ["定義", "言葉の意味を決めること"], ["論証", "理由から結論を導くこと"], ["反例", "主張に当てはまらない例"], ["対話", "考えをすり合わせること"]],
    stageLabel: "この記事の問い",
    boardText: "考えたことを書いたり、ほかの人の考えを聞いたりできます。読むだけならログインは不要です。",
  },
  science: {
    theme: "section-science",
    h1: "身のまわりの「どうして？」を、科学で。",
    intro: "科学は、答えの暗記ではなく、確かめ方の知恵です。仮説と実験の考え方から、ニュースや数字の読み方まで、身近な例で解説します。わからないことは掲示板でみんなに聞けます。",
    newSub: "科学の考え方と、確かめ方を解説する記事",
    ticker: [["仮説", "確かめる前の、仮の答え"], ["実験", "条件を変えて確かめる"], ["観察", "よく見て記録する"], ["再現性", "同じ方法で同じ結果が出ること"], ["対照群", "比べるためのグループ"], ["誤差", "測った値と本当の値のずれ"]],
    stageLabel: "この記事のキーワード",
    boardText: "身のまわりの疑問を質問したり、調べたことを共有したりできます。読むだけならログインは不要です。",
  },
  relationships: {
    theme: "section-relationships",
    h1: "人との関わりを、少しラクに。",
    intro: "聴き方、伝え方、距離のとり方。人との関わりで役に立つ考え方を、身近な場面で解説します。ひとりで抱えずに、掲示板でみんなに相談することもできます。",
    newSub: "人との関わりで役に立つ考え方を解説する記事",
    ticker: [["傾聴", "相手の話を最後まで聴く"], ["共感", "相手の気持ちを想像する"], ["感謝", "ありがとうを言葉にする"], ["境界線", "自分と相手の間に線を引く"], ["対話", "言い合いではなく話し合う"], ["自己開示", "自分のことを少し話す"]],
    stageLabel: "この記事のキーワード",
    boardText: "人との関わりで迷っていることを相談したり、うまくいった工夫を共有したりできます。読むだけならログインは不要です。",
  },
};
