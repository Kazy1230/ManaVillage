import "server-only";
import { getAllArticles, type ArticleMeta } from "@/lib/articles";
import { SECTIONS } from "@/lib/sections";

const PASTEL = ["var(--p1)", "var(--p2)", "var(--p3)", "var(--p4)", "var(--p5)", "var(--p6)"];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = (s: string) => s.replace(/<[^>]+>/g, "").trim();

// 内部リンクは、同じ科目の記事へのリンクだけをカードにする
function articleCard(slug: string, self: ArticleMeta): string | null {
  const all = getAllArticles(self.section);
  const a = all.find((x) => x.slug === slug);
  if (!a) return null;
  const bg = PASTEL[all.indexOf(a) % PASTEL.length];
  const thumb = a.coreIllustration
    ? `<img src="${esc(a.coreIllustration)}" alt="" loading="lazy">`
    : `<span class="en">${esc(a.keyword)}</span>`;
  return `<a class="link-card" href="${esc(a.url)}"><span class="link-card-thumb" style="background:${bg}">${thumb}</span><span class="link-card-body"><span class="link-card-title">${a.titleHtml}</span><span class="link-card-desc">${a.summaryHtml}</span><span class="link-card-site">manavillage.online</span></span></a>`;
}

function externalCard(url: string, text: string): string | null {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  const title = text && text !== url ? text : host;
  return `<a class="link-card" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><span class="link-card-thumb link-card-ext"><span>${esc(host.replace(/^www\./, "").charAt(0).toUpperCase())}</span></span><span class="link-card-body"><span class="link-card-title">${esc(title)}</span><span class="link-card-desc">${esc(url)}</span><span class="link-card-site">${esc(host)}</span></span></a>`;
}

// 本文の段落・リストに含まれるリンクごとに、そのブロックの直後へ埋め込みカードを入れる。
// 同じリンク先は記事内で最初の1回だけ。自分自身へのリンクは除く。
export function withLinkCards(html: string, self: ArticleMeta) {
  const base = SECTIONS[self.section].articles;
  const seen = new Set<string>([self.url]);
  const internalRe = new RegExp(`^${base.replace(/\//g, "\\/")}\\/([a-z0-9-]+)$`);
  return html.replace(/<(p|ul|ol)>[\s\S]*?<\/\1>/g, (block) => {
    const cards: string[] = [];
    for (const m of block.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      const href = m[1].replace(/&amp;/g, "&");
      const key = href.split("#")[0];
      if (seen.has(key)) continue;
      const internal = key.match(internalRe);
      const card = internal ? articleCard(internal[1], self) : /^https?:\/\//.test(key) ? externalCard(href, strip(m[2])) : null;
      if (!card) continue;
      seen.add(key);
      cards.push(card);
    }
    return cards.length ? `${block}\n<div class="link-cards">${cards.join("")}</div>` : block;
  });
}
