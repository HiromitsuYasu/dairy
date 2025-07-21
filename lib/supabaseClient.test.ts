import { describe, it, expect, beforeAll } from "vitest";
import { createSupabaseBrowserClient } from "./supabaseClient";

// 環境変数をモック
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
});

describe("supabaseClient", () => {
  it("ブラウザ用クライアントが初期化できる", () => {
    const client = createSupabaseBrowserClient();
    expect(client).toBeDefined();
    expect(typeof client.auth.getSession).toBe("function");
  });
});
