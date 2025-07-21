import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export type TypedSupabaseClient = SupabaseClient<any, string, any>;

// ブラウザ用クライアント
export const createSupabaseBrowserClient = () => {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
};

// サーバ用クライアント（App RouterのServer Component/Action用）
// cookiesはnext/headersから渡す（実際の利用時に）
export const createSupabaseServerClient = (cookies: any) => {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies });
};
