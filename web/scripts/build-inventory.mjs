// 在庫(テーマの全体リスト)の初版を作る: node scripts/build-inventory.mjs
// 候補を分類ごとに組み立て、Google の検索候補(サジェスト)で「実際に検索されているか」を確かめて需要の点数を付ける。
// 出力: content/planning/inventory.csv(英語学習)、content/planning/japanese/inventory.csv(日本語学習)
// 需要の点数は目安: 2 = その語句そのものが候補に出る / 1 = その語句で始まる候補がある / 0 = 候補がない(検索が少ないとみなす)
// 既存の topic-map の主キーワードと同じものは除く。再実行すると作り直す(状態の列は上書きされるので、初版の作成専用)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- 英語学習(日本語で書く。読者は日本語話者) ----------

const STUDY = [
  ["英単語 覚え方", "英単語の覚え方"], ["英文法 勉強法", "教材の選び方・進め方"], ["英語 リスニング 勉強法", "発音・リスニング"],
  ["英語 スピーキング 練習", "独り言・スピーキング"], ["英語 発音 練習", "発音・リスニング"], ["英語 独学", "教材の選び方・進め方"],
  ["英語 多読", "教材の選び方・進め方"], ["シャドーイング やり方", "発音・リスニング"], ["英語 音読", "発音・リスニング"],
  ["英語 日記", "独り言・スピーキング"], ["英語 勉強 続かない", "勉強の続け方"], ["英語 勉強 時間", "勉強の続け方"],
  ["英会話 独学", "独り言・スピーキング"], ["英語 勉強 何から", "教材の選び方・進め方"], ["英語 長文 読み方", "教材の選び方・進め方"],
  ["英作文 練習", "独り言・スピーキング"], ["英語 語彙力", "英単語の覚え方"], ["英語 勉強 アプリ", "教材の選び方・進め方"],
  ["英語 勉強 習慣", "勉強の続け方"], ["英語 参考書 選び方", "教材の選び方・進め方"], ["英語 勉強 モチベーション", "勉強の続け方"],
  ["英語 映画 勉強", "教材の選び方・進め方"], ["英語 ポッドキャスト 勉強", "発音・リスニング"], ["英語 ニュース 勉強", "教材の選び方・進め方"],
];
const READERS = ["中学生", "高校生", "大学生", "社会人", "初心者", "大人", "主婦", "小学生", "子ども", "シニア"];

const EXAMS = [
  ...["5級", "4級", "3級", "準2級", "2級", "準1級", "1級"].flatMap((g) => [`英検${g} 勉強法`, `英検${g} 面接`, `英検${g} ライティング`]),
  ...["600", "700", "800", "900"].map((s) => `TOEIC ${s}点 勉強法`),
  ...["1", "2", "3", "4", "5", "6", "7"].map((p) => `TOEIC パート${p} コツ`),
  "TOEIC 単語 覚え方", "TOEIC 勉強 時間", "TOEIC スピーキング 対策", "IELTS 勉強法", "TOEFL 勉強法", "大学受験 英語 勉強法", "共通テスト 英語 リスニング 対策", "高校受験 英語 勉強法",
];

const GRAMMAR = [
  "be動詞", "三人称単数", "現在進行形", "過去進行形", "未来形 will be going to", "助動詞 must have to", "助動詞 should", "比較級 最上級", "原級 比較",
  "不定詞", "動名詞", "不定詞 動名詞 違い", "受動態", "現在完了", "現在完了進行形", "過去完了", "未来完了", "関係代名詞", "関係代名詞 what", "関係副詞",
  "仮定法過去", "仮定法過去完了", "仮定法 I wish", "分詞 形容詞的用法", "分詞構文", "間接疑問文", "付加疑問文", "使役動詞", "知覚動詞", "冠詞 a the",
  "可算名詞 不可算名詞", "時制の一致", "話法", "倒置", "強調構文", "無生物主語", "5文型", "There is 構文", "命令文", "感嘆文", "再帰代名詞",
  "many much 違い", "few little 違い", "some any 違い", "it 形式主語", "疑問詞", "接続詞 that", "否定疑問文 答え方", "部分否定", "二重否定",
].map((g) => (g.includes("違い") || g.includes("答え方") ? g : `${g} わかりやすく`));

// ① 似た単語
const WORDS = [
  "see look watch", "hear listen", "speak talk say tell", "borrow lend rent", "by until", "during while", "between among", "almost most",
  "bring take", "come go", "wear put on", "learn study", "job work", "problem trouble", "big large", "small little", "house home",
  "maybe probably perhaps", "also too either", "already yet still", "ago before", "remember remind", "rob steal", "fun funny",
  "interesting interested", "lie lay", "rise raise", "sometimes occasionally", "travel trip journey", "price cost fee", "customer client guest",
  "hope wish", "think feel", "wait await", "reach arrive get to", "fix repair", "choose select pick", "begin start", "end finish", "kind type sort",
].map((w) => `${w} 違い`);
// ② 機能の言い換え・③ 丁寧さと場面の違い
const FUNCTIONS = [
  "英語 依頼 丁寧", "英語 断り方", "英語 謝罪 表現", "英語 お礼 表現", "英語 提案 表現", "英語 誘い方", "英語 許可 求める", "英語 意見 言い方",
  "英語 同意 表現", "英語 反対 言い方", "英語 理由 言い方", "英語 推測 表現", "英語 感情 表現", "英語 相づち", "英語 聞き返し", "英語 励ます",
  "英語 褒める", "英語 自己紹介", "英語 メール 書き出し", "英語 メール 結び", "ビジネス英語 依頼", "英語 注意する 言い方", "英語 確認する 言い方", "英語 お願い 言い方",
];
const COMPARE = [
  "Could you Would you 違い", "I think I guess 違い", "want would like 違い", "sorry excuse me 違い", "Thank you Thanks 違い", "must have to 違い",
  "should had better 違い", "will be going to 違い", "can be able to 違い", "may might 違い", "Can I May I 違い", "I'm sorry I apologize 違い",
  "I'm afraid I'm sorry 違い", "Please kindly 違い", "used to be used to 違い", "Let's Shall we 違い", "Do you mind Would you mind 違い", "Hello Hi 違い",
];
// ④ 母語からのずれ
const NATIVE = [
  "よろしく", "お疲れ様", "いただきます", "頑張って", "お世話になっております", "大丈夫", "すみません", "しょうがない", "いってきます", "おかえり",
  "なるほど", "ちょっと", "とりあえず", "せっかく", "もったいない", "懐かしい", "楽しみ", "さすが", "めんどくさい", "気をつけて",
].map((w) => `${w} 英語`);
const PREP = ["in on at 違い", "to for 違い", "with by 違い", "for since 違い", "get 句動詞", "take 句動詞", "look 句動詞", "put 句動詞", "come 句動詞", "go 句動詞", "make do 違い", "have get 違い"];

// ---------- 日本語学習(英語で書く。読者は英語話者) ----------

const J_GRAMMAR = [
  // よく初級(N5〜N4)で学ぶ形
  ["te form", "N5"], ["masu form", "N5"], ["nai form", "N5"], ["ta form", "N5"], ["tai form", "N5"], ["masen ka", "N5"], ["mashou", "N5"],
  ["te kudasai", "N5"], ["te mo ii", "N4"], ["te wa ikenai", "N4"], ["nakereba naranai", "N4"], ["i adjectives vs na adjectives", "N5"],
  ["ko so a do", "N5"], ["japanese counters", "N5"], ["potential form", "N4"], ["volitional form", "N4"], ["ba form conditional", "N4"],
  ["tara conditional", "N4"], ["nara conditional", "N4"], ["to conditional", "N4"], ["passive form", "N4"], ["causative form", "N4"],
  ["causative passive", "N3"], ["sou desu", "N4"], ["you desu", "N4"], ["rashii", "N4"], ["te shimau", "N4"], ["te oku", "N4"], ["te miru", "N4"],
  ["te aru vs te iru", "N4"], ["noni", "N4"], ["node", "N4"], ["shi", "N4"], ["yasui nikui", "N4"], ["hazu", "N4"], ["kamoshirenai", "N4"],
  ["deshou", "N5"], ["nagara", "N4"], ["mae ni ato de", "N5"], ["tame ni", "N4"], ["you ni", "N4"], ["tsumori", "N4"], ["tokoro", "N4"],
  // よく中級(N3〜)で学ぶ形
  ["you ni naru", "N3"], ["koto ni suru", "N3"], ["koto ni naru", "N3"], ["bakari", "N3"], ["ppoi", "N3"], ["mitai", "N3"], ["ni yoru to", "N3"],
  ["wake", "N3"], ["wake ja nai", "N3"], ["wake ni wa ikanai", "N2"], ["ni kanshite", "N3"], ["ni tsuite", "N4"], ["ni totte", "N3"],
  ["ba yokatta", "N3"], ["hodo", "N3"], ["kurai", "N3"], ["sae", "N2"], ["koso", "N2"], ["mono", "N2"], ["kke", "N3"],
].map(([g, lv]) => [`${g} japanese grammar`, lv]);
const J_PARTICLES = [
  "wa vs ga", "ni vs de", "ni vs e", "o vs ga", "mo particle", "to vs ya", "kara made", "yori", "no particle", "ka particle", "ne vs yo",
  "dake vs shika", "made ni vs made", "ni vs to", "sentence ending particles japanese", "toka particle", "demo particle",
].map((p) => (p.includes("japanese") ? p : `${p} japanese`));
const J_WORDS = [
  "miru vs mieru", "kiku vs kikoeru", "shiru vs wakaru", "omou vs kangaeru", "iku vs kuru", "ageru kureru morau", "aku vs akeru",
  "hairu vs ireru", "deru vs dasu", "tsuku vs tsukeru", "kieru vs kesu", "suki vs daisuki", "kirei vs utsukushii", "hayai 早い 速い",
  "atsui 暑い 熱い", "kaku 書く 描く", "ookii vs ookina", "takai yasui hikui", "naru vs suru", "aru vs iru", "ima vs mou", "mada vs mou",
].map((w) => `${w} japanese`);
const J_FUNCTIONS = [
  "how to say sorry in japanese", "how to say thank you in japanese", "how to say please in japanese", "how to say no politely in japanese",
  "how to ask permission in japanese", "how to make a request in japanese", "how to invite someone in japanese", "how to give advice in japanese",
  "how to say i think in japanese", "how to say because in japanese", "how to say but in japanese", "how to say maybe in japanese",
  "how to say must in japanese", "how to say want in japanese", "how to say can in japanese", "how to say i don't know in japanese",
  "how to say excuse me in japanese", "how to say hello in japanese", "how to say goodbye in japanese", "how to say yes in japanese",
  "how to say if in japanese", "how to agree in japanese", "how to disagree politely in japanese",
];
const J_COMPARE = [
  "sumimasen vs gomennasai", "kudasai vs onegaishimasu", "kara vs node", "kedo vs demo", "tabun vs kamoshirenai", "arigatou vs arigatou gozaimasu",
  "sayonara vs ja ne", "hai vs ee", "wakaranai vs shiranai", "dekiru vs potential form", "tai vs hoshii", "desu masu vs casual",
  "sonkeigo vs kenjougo", "teineigo", "otsukaresama meaning", "yoroshiku onegaishimasu meaning", "itadakimasu meaning", "ganbatte meaning",
];
const J_SITUATIONS = [
  "japanese phrases restaurant", "japanese phrases convenience store", "japanese phrases train station", "japanese phrases hotel",
  "japanese phrases doctor", "japanese phrases workplace", "japanese self introduction", "japanese phone phrases", "japanese email phrases",
  "japanese phrases for travel", "japanese phrases shopping",
];
const J_STUDY = [
  "how to learn hiragana", "how to learn katakana", "how to learn kanji", "how to learn japanese", "how to learn japanese fast",
  "how to study for jlpt n5", "how to study for jlpt n4", "how to study for jlpt n3", "how to study for jlpt n2", "how to study for jlpt n1",
  "japanese for beginners", "japanese listening practice", "japanese speaking practice", "japanese reading practice", "japanese pitch accent",
];
const J_READERS = ["for adults", "for kids", "for beginners", "for self study", "for travelers", "for business"];

// ---------- サジェスト ----------

async function suggest(q, hl, gl) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&q=${encodeURIComponent(q)}`;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const data = JSON.parse(await res.text());
      return (data[1] ?? []).map((s) => String(s).toLowerCase());
    } catch {
      await sleep(1500);
    }
  }
  return [];
}

const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
async function demand(q, hl, gl) {
  const list = await suggest(q, hl, gl);
  await sleep(250);
  const n = norm(q);
  if (list.some((s) => norm(s) === n)) return [2, list.length];
  if (list.some((s) => norm(s).startsWith(n))) return [1, list.length];
  return [0, list.length];
}

function existing(file) {
  if (!fs.existsSync(file)) return new Set();
  return new Set(fs.readFileSync(file, "utf8").split("\n").filter((l) => /^\|\s*[A-Z]+-?\d+/.test(l)).map((l) => norm(l.split("|")[4] ?? "")));
}

const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

async function build(rows, hl, gl, prefix, used, out) {
  const seen = new Set();
  const result = [];
  let i = 0;
  for (const r of rows) {
    const key = norm(r.keyword);
    if (seen.has(key) || used.has(key)) continue;
    seen.add(key);
    const [d, n] = await demand(r.keyword, hl, gl);
    // 読者違いの候補は、サジェストにその組み合わせが出るときだけ残す(ワークフローの「読者違いの記事」の条件1)
    if (r.reader && d === 0) continue;
    i++;
    result.push({ id: `${prefix}${String(i).padStart(4, "0")}`, ...r, demand: d, suggestions: n });
    if (i % 25 === 0) console.log(`${prefix}: ${i}`);
  }
  // 需要の高い順、同じなら分類の順
  result.sort((a, b) => b.demand - a.demand || b.suggestions - a.suggestions);
  const cols = ["id", "category", "layer", "keyword", "reader", "level", "hub", "demand", "suggestions", "status", "slug", "note"];
  const lines = [cols.join(",")].concat(result.map((r) => cols.map((c) => csvCell(r[c] ?? (c === "status" ? "idea" : ""))).join(",")));
  fs.writeFileSync(out, lines.join("\n") + "\n");
  console.log(`${out}: ${result.length} rows (demand 2: ${result.filter((r) => r.demand === 2).length}, 1: ${result.filter((r) => r.demand === 1).length}, 0: ${result.filter((r) => r.demand === 0).length})`);
}

const en = [
  ...STUDY.map(([k, hub]) => ({ category: "勉強法", keyword: k, hub })),
  ...STUDY.flatMap(([k, hub]) => READERS.map((rd) => ({ category: "勉強法(読者別)", keyword: `${k} ${rd}`, reader: rd, hub }))),
  ...EXAMS.map((k) => ({ category: "試験", keyword: k, hub: "試験対策" })),
  ...GRAMMAR.map((k) => ({ category: "英文法", keyword: k, hub: "英文法・語法" })),
  ...WORDS.map((k) => ({ category: "似た言葉", layer: "①似た単語", keyword: k, hub: "英文法・語法" })),
  ...FUNCTIONS.map((k) => ({ category: "似た言葉", layer: "②機能の言い換え", keyword: k, hub: "英会話フレーズ" })),
  ...COMPARE.map((k) => ({ category: "似た言葉", layer: "③丁寧さ・場面の違い", keyword: k, hub: "英会話フレーズ" })),
  ...NATIVE.map((k) => ({ category: "似た言葉", layer: "④母語からのずれ", keyword: k, hub: "英会話フレーズ" })),
  ...PREP.map((k) => ({ category: "前置詞・句動詞", layer: "①似た単語", keyword: k, hub: "英文法・語法" })),
];
const ja = [
  ...J_GRAMMAR.map(([k, lv]) => ({ category: "Grammar", keyword: k, level: lv, hub: "Grammar" })),
  ...J_PARTICLES.map((k) => ({ category: "Particles", layer: "①似た単語", keyword: k, hub: "Particles" })),
  ...J_WORDS.map((k) => ({ category: "Synonyms", layer: "①似た単語", keyword: k, hub: "Synonyms" })),
  ...J_FUNCTIONS.map((k) => ({ category: "Phrases", layer: "②機能の言い換え", keyword: k, hub: "Phrases" })),
  ...J_COMPARE.map((k) => ({ category: "Politeness", layer: "③丁寧さ・場面の違い", keyword: k.includes("meaning") || k === "teineigo" ? k : `${k} japanese`, hub: k.includes("meaning") ? "Phrases" : "Politeness" })),
  ...J_SITUATIONS.map((k) => ({ category: "Phrases", layer: "③丁寧さ・場面の違い", keyword: k, hub: "Phrases" })),
  ...J_STUDY.map((k) => ({ category: "Study", keyword: k, hub: "Study" })),
  ...J_STUDY.slice(0, 5).flatMap((k) => J_READERS.map((rd) => ({ category: "Study(読者別)", keyword: `${k} ${rd}`, reader: rd, hub: "Study" }))),
];

await build(en, "ja", "jp", "E-", existing(path.join(root, "content/planning/topic-map.md")), path.join(root, "content/planning/inventory.csv"));
await build(ja, "en", "us", "J-", existing(path.join(root, "content/planning/japanese/topic-map.md")), path.join(root, "content/planning/japanese/inventory.csv"));
