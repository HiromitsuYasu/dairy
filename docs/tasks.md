# Diary App MVP — Step‑by‑Step Task List

> **目的**: アーキテクチャに沿って *最小実行単位* のタスクを列挙。各タスクは *小さく・テスト可能* で *単一の関心事* に集中。Cursor で 3 タブ開き、担当を明示。

| タブ        | 担当領域              | 例                         | VS Code 側の開き方            |
| --------- | ----------------- | ------------------------- | ------------------------ |
| **Tab A** | フロントエンド (UI / UX) | Next.js pages, components | `/app`, `/components`    |
| **Tab B** | バックエンド & DB       | Supabase クライアント / SQL     | `/lib`, SQL migrations   |
| **Tab C** | DevOps / QA       | Git, CI, Lint, Tests, Env | root configs, `.github/` |

---

## Phase 1 — プロジェクト初期化

| ID      | タスク                                             | タブ | 完了条件 (テスト方法)                                   |
| ------- | ----------------------------------------------- | -- | ---------------------------------------------- |
| **T01** | GitHub リポジトリ作成 & `main` push                    | C  | `git log` に初回コミットが存在し、GitHub で repo URL が確認できる |
| **T02** | `create-next-app@latest` で TypeScript テンプレ生成    | C  | `pnpm dev` で localhost 起動し、初期画面が表示される          |
| **T03** | Tailwind + shadcn/ui インストール & `globals.css` セット | A  | `class="text-primary"` が適用されるテストページを確認         |
| **T04** | Cursor 設定ファイル (`.vscode/settings.json`) 追加      | C  | Cursor で補完が有効に動く                               |
| **T05** | ESLint + Prettier 設定 & `pnpm lint` スクリプト        | C  | lint 実行でエラー 0 件                                |

---

## Phase 2 — Supabase & 環境変数

| ID      | タスク                                           | Tab | 完了条件                                                         |
| ------- | --------------------------------------------- | --- | ------------------------------------------------------------ |
| **T06** | Supabase プロジェクト作成 (Free Tier)                 | C   | URL / anon key が発行されダッシュボードに入れる                              |
| **T07** | `.env.local` へ `SUPABASE_URL` & `ANON_KEY` 設定 | C   | `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)` が期待値     |
| **T08** | `lib/supabaseClient.ts` でブラウザ & サーバ両用クライアント実装 | B   | `supabaseClient.auth.getSession()` が実行可能                     |
| **T09** | DB スキーマ `entries` 作成 (SQL エディタ)               | B   | `select * from entries` が成功し、列定義が一致                          |
| **T10** | RLS ポリシー `user_crud_own` 有効化                  | B   | 異なる `service_role` で insert → OK、anon key で他ユーザ行 insert → 失敗 |

---

## Phase 3 — 認証フロー

| ID      | タスク                                            | Tab | 完了条件                                |
| ------- | ---------------------------------------------- | --- | ----------------------------------- |
| **T11** | `/app/(auth)/login/page.tsx` 作成 (メール入力フォーム)    | A   | 入力 → Magic Link メールが届く              |
| **T12** | `getSession()` server action で SSR セッション取得     | B   | console で `user.id` が出力される          |
| **T13** | `AuthGuard` HOC を作成し `/dashboard` 非ログイン時リダイレクト | A   | 未ログインで `/dashboard` へ → `/login` 転送 |
| **T14** | Playwright にログイン E2E テスト追加                     | C   | `pnpm test:e2e` グリーン                |

---

## Phase 4 — CRUD 基盤

| ID      | タスク                                                   | Tab | 完了条件                                |
| ------- | ----------------------------------------------------- | --- | ----------------------------------- |
| **T15** | `types.ts` に `Entry` 型定義                              | B   | `Entry` import 時に型補完表示              |
| **T16** | `EntryForm.tsx` (title + textarea + status select) 実装 | A   | 入力後 submit で onSubmit 発火            |
| **T17** | `/app/entry/new/page.tsx` で create server action 呼び出し | A   | 送信後 `/dashboard` に新規カード表示           |
| **T18** | `createEntry` server action (insert) 実装               | B   | データベースに行が追加される                      |
| **T19** | `/app/dashboard/page.tsx` 一覧取得 (supabase from)        | B   | ログインユーザの entries のみ表示               |
| **T20** | `MarkdownViewer.tsx` で `react-markdown` 表示            | A   | 見出し / 箇条書きレンダリング確認                  |
| **T21** | `/app/entry/[id]/page.tsx` 詳細 & `Edit` ルート作成          | A   | 既存日記が Markdown 表示され `Edit` でフォームに遷移 |
| **T22** | `updateEntry` & `deleteEntry` actions 実装              | B   | 各操作後に DB が更新 / 削除される                |
| **T23** | Vitest 単体テスト: `createEntry` 成功 / RLS 失敗ケース            | C   | `pnpm test:unit` グリーン               |

---

## Phase 5 — UI/UX 仕上げ

| ID      | タスク                                     | Tab | 完了条件                                  |
| ------- | --------------------------------------- | --- | ------------------------------------- |
| **T24** | shadcn `ThemeToggle` 実装 & `dark:` クラス適用 | A   | ボタン押下でダーク / ライト切替                     |
| **T25** | `framer-motion` でダッシュボードカードフェードイン       | A   | 初回ロード時にアニメーション表示                      |
| **T26** | PWA manifest & icons (`public/`) 追加     | C   | Chrome DevTools → PWA pass            |
| **T27** | Lighthouse モバイル Performance ≥ 80        | C   | `pnpm run build` → `lighthouse-ci` 合格 |

---

## Phase 6 — デプロイ & モニタリング

| ID      | タスク                                        | Tab | 完了条件                                      |
| ------- | ------------------------------------------ | --- | ----------------------------------------- |
| **T28** | Vercel プロジェクトリンク & Preview デプロイ            | C   | `https://diary-app.vercel.app` Preview 稼働 |
| **T29** | Production ブランチ保護 & 自動デプロイ設定               | C   | `main` マージで Production 更新                 |
| **T30** | Vercel Analytics Basic 有効化                 | C   | ダッシュボードに PV グラフ表示                         |
| **T31** | Sentry SDK 初期化 & 404 ハンドリング                | B   | 強制エラーで Sentry にイベントが飛ぶ                    |
| **T32** | Plausible script 埋め込み (`NEXT_PUBLIC` ドメイン) | A   | 管理画面で PV 記録                               |

---

## Phase 7 — リリース後フィードバック準備

| ID      | タスク                                        | Tab | 完了条件                         |
| ------- | ------------------------------------------ | --- | ---------------------------- |
| **T33** | Supabase Edge cron: 週次 `entries` 件数集計 & ログ | B   | `logs.weekly_usage` テーブルに行追加 |
| **T34** | `Feedback` Google Form リンクをフッターに追加         | A   | クリックでフォーム新タブ表示               |
| **T35** | README にデプロイ手順・環境変数ドキュメント化                 | C   | 新規開発者がローカル起動成功               |

---

### 完了基準

MVP は **T01 〜 T31** がすべてグリーンで達成。以降のタスクはユーザーテスト結果に応じて優先調整する。

---

> **使い方（Cursor）**
>
> 1. Tab C で環境 & CI を整えつつ、Tab B でクライアント & DB 接続を試し、Tab A で UI を実装。
> 2. 各タスク完了ごとに `git commit -m "feat: Txx ..."` で番号を残し、PR テンプレにチェックリストをコピー。
