# システム全体アーキテクチャ

```
┌──────────────────┐
│   End‑User (Web / PWA)  │
└────────▲─────────┘
         │ HTTPS
         │
┌────────┴─────────┐
│   Vercel (Edge Network) │  ← ビルド & CDN 配信
└────────▲─────────┘
         │ Serverless Functions (App Router / Route Handlers)
         │
┌────────┴─────────┐
│   Supabase Project       │
│  ─ Postgres (Free Tier)  │  ← Row‑Level Security
│  ─ Realtime / Edge Fn.   │  ← cron & Webhook 処理
│  ─ Auth (Magic Link)     │
│  ─ Storage (省略可)      │
└────────▲─────────┘
         │
         │ REST / RPC / WebSocket
         │
┌────────┴─────────┐
│   外部サービス               │
│  ─ Vercel Analytics         │
│  ─ Sentry (Error Tracking)  │
│  ─ Plausible (PV 計測)       │
└──────────────────┘
```

* **フロント**: Next.js 14 (App Router) + Tailwind + shadcn/ui。
* **ホスティング**: Vercel Hobby。静的資産は CDN、必要箇所のみ Serverless Functions。
* **バックエンド**: Supabase Free Tier (Postgres + Auth + Realtime + Edge Functions)。
* **ジョブ/バッチ**: Supabase Edge Functions の `cron()` を利用。
* **監視/分析**: Vercel Analytics Basic、Sentry Free、Plausible Free Trial。
* **CI/CD**: GitHub → Vercel Preview → Production デプロイ。

---

## ディレクトリ & ファイル構成

```
/ (repo root)
├─ app/                       # App Router ルート
│  ├─ layout.tsx              # 共有レイアウト
│  ├─ page.tsx                # ルートリダイレクト
│  ├─ (auth)/
│  │   ├─ login/page.tsx
│  │   └─ callback/route.ts
│  ├─ dashboard/
│  │   └─ page.tsx
│  ├─ entry/
│  │   ├─ new/page.tsx
│  │   └─ [id]/page.tsx
│  └─ settings/page.tsx
│
├─ components/
│  ├─ EntryForm.tsx
│  ├─ EntryCard.tsx
│  ├─ MarkdownViewer.tsx
│  └─ ThemeToggle.tsx
│
├─ lib/
│  ├─ supabaseClient.ts
│  ├─ auth.ts
│  └─ types.ts
│
├─ styles/
│  └─ globals.css
│
├─ tests/                     # Vitest / Playwright
│
├─ public/                    # favicon, PWA icons, manifest
│
├─ .github/workflows/ci.yml   # Lint → Test → Preview
├─ .env.example
├─ next.config.mjs
├─ tailwind.config.mjs
├─ tsconfig.json
└─ README.md
```

---

## データベーススキーマ (v1)

```sql
-- users は Supabase auth.users を使用
create table entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  status text default 'published' check (status in ('draft','published')),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table entries enable row level security;
create policy "user_crud_own" on entries
  using (auth.uid() = user_id);
```

---

## CI/CD フロー

1. **Pull Request**: GitHub Actions で ESLint → Type Check → Vitest。
2. **main マージ**: Vercel Preview ビルド → Production デプロイ。
3. **DB Migration**: `supabase db remote commit` で SQL をリポジトリへコミット。

---

## 拡張余地例

| 項目   | 今後の拡張アイデア                              |
| ---- | -------------------------------------- |
| PWA  | オフライン投稿キュー → Edge Function sync        |
| 画像添付 | Supabase Storage & `entry_images` テーブル |
| 検索   | Postgres `tsvector` → Meilisearch 移行   |
| 通知   | Web Push → Resend でメールまとめ              |
