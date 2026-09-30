import type { Metadata } from "next";
import Link from "next/link";
import { createThread } from "@/app/actions";
import ActionForm from "@/components/ActionForm";
import { requireViewer } from "@/lib/auth";
import { listCategories } from "@/lib/queries";

export const metadata: Metadata = { title: "スレッドを作る" };

export default async function NewThreadPage() {
  await requireViewer("/boards/new");
  const categories = await listCategories();

  return (
    <div className="screen">
      <div className="wrap reader-grid">
        <div className="panel paper intro">
          <div className="crumb"><Link href="/boards">掲示板</Link><span>/</span><span>新しいスレッド</span></div>
          <h1 style={{ marginBottom: 8 }}>スレッドを作る</h1>
          <p className="sub" style={{ marginBottom: 32 }}>返信がつくと登録メールアドレスにお知らせします。</p>
          <ActionForm action={createThread} submitLabel="スレッドを作成する" pendingLabel="作成中…">
            {categories.length > 0 && (
              <label className="field" htmlFor="nt-cat">
                カテゴリを選ぶ
                <select id="nt-cat" name="category_id" defaultValue="">
                  <option value="">選択してください</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            )}
            {categories.length > 0 && <div className="or">または</div>}
            <label className="field" htmlFor="nt-newcat">
              新しいカテゴリを作る
              <input id="nt-newcat" name="new_category" maxLength={30} placeholder="例：発音の悩み" />
              <span className="hint">入力すると、上で選んだカテゴリより優先されます。同じ名前のカテゴリがあればそちらに入ります。</span>
            </label>
            <label className="field" htmlFor="nt-title">
              タイトル
              <input id="nt-title" name="title" required maxLength={100} placeholder="例：英語日記を続けるコツを教えてください" />
              <span className="hint">一覧に表示されます。内容がひと目でわかるタイトルにしましょう。</span>
            </label>
            <label className="field" htmlFor="nt-body">
              本文
              <textarea id="nt-body" name="body" required maxLength={5000} placeholder="聞きたいこと、話したいことを書いてください" />
            </label>
          </ActionForm>
        </div>
      </div>
    </div>
  );
}
