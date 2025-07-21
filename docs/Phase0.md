## Phase 0 アイデア & 設計 (Day 0)

> **目標**: MVP（メール認証 + 日記 CRUD + デプロイ）に必要な設計を 90 分以内で決定し、以降の実装タスクを洗い出す。

### 0‑1 ユーザーペルソナ
| ペルソナ      | 動機                                   | 主な利用シーン              |
| ------------- | -------------------------------------- | --------------------------- |
| 社会人A (25)  | 毎日感じたことを短くメモし自己振り返りしたい | 通勤電車でモバイル投稿      |
| 学生B (19)    | 留学準備の学習記録として使いたい           | PC でまとめ書き & スマホで確認 |

### 0‑2 ユーザーストーリー
| ID   | ストーリー                                                         | 優先度 |
| ---- | ------------------------------------------------------------------ | ------ |
| US‑1 | ユーザーとして、メールリンクでログインし自分の日記だけを管理したい           | ★★★ |
| US‑2 | 日記を Markdown で書き、改行や見出しを整えて読み返したい                 | ★★★ |
| US‑3 | 書き途中の日記を下書き保存し、あとから編集したい                          | ★★☆ |
| US‑4 | ダークモードで目の負担を減らしたい                                   | ★★☆ |
| US‑5 | スマホと PC の両方で快適に操作したい                                | ★★★ |

### 0‑3 機能要件
1. **認証**: Supabase Email Magic Link  
2. **投稿 CRUD**: Create / Read / Update / Delete 自分のエントリー  
3. **Markdown 対応**: `react-markdown` で表示、`textarea` で入力  
4. **レスポンシブ**: Tailwind + shadcn/ui  
5. **下書き**: `status` 列 (`draft` or `published`) で管理  

### 0‑4 非機能要件
- サーバレス & 無料枠で運用  
- 1 週間で MVP 完成 → 友人 3 名にユーザーテスト  
- 1 クリックデプロイ (Vercel)  

### 0‑5 DB スキーマ v1
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

### 0‑6 ワイヤーフレーム (テキスト表現)
- /dashboard: カード一覧 (タイトル + 先頭 100 文字)
- /entry/new: タイトル入力 + Markdown textarea + Save Draft / Publish ボタン
- /entry/[id]: Markdown 表示 + Edit / Delete
- /settings: ダークモード切替トグル
