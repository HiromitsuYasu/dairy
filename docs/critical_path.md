
# Diary App MVP — Critical Path

> このリストは **MVP を最短でリリースするために、1 つでも遅れると全体スケジュールへ影響するタスクのみ** を依存順に並べたものです。タスク ID は `mvp_tasks.md` と対応しています。

| Seq | 依存    | タスク ID  | 内容                            | 推定所要   | Tab |
| --- | ----- | ------- | ----------------------------- | ------ | --- |
| 1   | —     | **T01** | GitHub リポジトリ作成 & 初回コミット       | 30 min | C   |
| 2   | 1     | **T02** | `create-next-app` でプロジェクト初期化  | 30 min | C   |
| 3   | 2     | **T06** | Supabase プロジェクト作成 (Free Tier) | 15 min | C   |
| 4   | 3     | **T07** | `.env.local` に URL / Key 設定   | 10 min | C   |
| 5   | 4     | **T08** | `supabaseClient.ts` 実装        | 20 min | B   |
| 6   | 5     | **T09** | `entries` テーブル作成              | 10 min | B   |
| 7   | 6     | **T10** | RLS ポリシー `user_crud_own` 有効化  | 10 min | B   |
| 8   | 7     | **T11** | `/login` 画面 & Magic‑Link 認証   | 45 min | A   |
| 9   | 8     | **T13** | `AuthGuard` で `/dashboard` 保護 | 20 min | A   |
| 10  | 9     | **T16** | `EntryForm.tsx` 作成            | 40 min | A   |
| 11  | 10    | **T18** | `createEntry` server action   | 30 min | B   |
| 12  | 11    | **T17** | `/entry/new` 画面 ➜ 投稿          | 25 min | A   |
| 13  | 11    | **T19** | `/dashboard` 一覧取得 & 表示        | 25 min | B   |
| 14  | 12,13 | **T21** | `/entry/[id]` 詳細ページ           | 20 min | A   |
| 15  | 14    | **T22** | `updateEntry` & `deleteEntry` | 30 min | B   |
| 16  | 15    | **T24** | ダークモード切替 `ThemeToggle`        | 20 min | A   |
| 17  | 15    | **T28** | Vercel Preview デプロイ           | 15 min | C   |
| 18  | 17    | **T29** | Production 自動デプロイ設定           | 15 min | C   |
| 19  | 18    | **T31** | Sentry SDK 初期化                | 20 min | B   |
| 20  | 18    | **T30** | Vercel Analytics 有効化          | 10 min | C   |

**最短所要時間 (理論値)** ≈ **7 時間 35 分**
※ ビルド／レビュー待ちを考慮し 1.5〜2 営業日を想定。

---

### 実行ヒント

1. **T01〜T03**: コードを書く前に Supabase キーを発行しておくと、その後の生成コードがスムーズ。
2. **T11 と T13**: 認証フローと保護ルートは Preview 公開前に実装し、データ漏洩リスクを排除。
3. **T28〜T29**: Vercel Production 環境での環境変数設定漏れが最頻トラブル。Preview で確認後に Production ブランチ保護を設定。

クリティカルパス以外のタスク（UI アニメーションやテスト拡充など）はこれらが完了した後、バッファ内で並行して進めても MVP 進捗へ影響しません。
