import Link from "next/link";
import SubjectTabs from "@/components/SubjectTabs";
import { liveSections } from "@/lib/articles";
import { initial } from "@/lib/format";
import { t } from "@/lib/i18n";
import { lp } from "@/lib/paths";
import { SECTIONS, type Lang } from "@/lib/sections";

type Viewer = { nickname: string } | null;

export default function SiteHeader({ lang, viewer }: { lang: Lang; viewer: Viewer }) {
  const s = t(lang);
  const tabs = liveSections().map((k) => ({ key: k, label: SECTIONS[k].label, top: SECTIONS[k].top, lang: SECTIONS[k].lang }));
  return (
    <header className="site-head bleed" id="site-head">
      <div className="head-in">
        <Link className="logo" href="/" lang="ja"><i />まなビレッジ</Link>
        <SubjectTabs tabs={tabs} board={s.board} lang={lang} />
        <div className="acct">
          {viewer ? (
            <Link className="avatar" href={lp(lang, "/mypage")} aria-label={`${s.mypage}（${viewer.nickname}）`}>{initial(viewer.nickname)}</Link>
          ) : (
            <Link className="btn primary" href={lp(lang, "/login")}>{s.login}</Link>
          )}
        </div>
      </div>
    </header>
  );
}
