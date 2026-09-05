# インフラ初期設定（Supabase / Cloudflare / Resend）

登録済みの各ダッシュボードで、以下を順に実施してください。  
**APIキー・パスワードはチャットに貼らず**、ローカルの `.env.local` のみに保存します。

## 1. Supabase

1. **SQL Editor** で `supabase/schema.sql` の内容を実行  
   既存プロジェクトは `supabase/migrations/20260829_security_rate_limits.sql` も追加実行（レート制限テーブル + 予約の anon INSERT 削除）
2. **Settings → API** からコピー:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`（サーバー専用・漏洩厳禁）
3. **Settings → Database** でパスワードを vault に保存
4. 制作担当を **Project Settings → Team** から Invite（Developer 以上）

### 休止防止（Cloudflare Cron）

Supabase 無料プランは **約7日間アクセスがないとプロジェクトが一時停止** します。  
本番 Worker に **Cloudflare Cron** を設定済みです（`wrangler.jsonc` → 月・木 03:00 UTC）。

- Cron 実行時: `cloudflare-worker.ts` の `scheduled` → Supabase `sites` テーブルを1件読む
- 手動確認: `GET /api/health` → `{ "ok": true, "supabase": "ok" }`

ローカルで Cron を試す場合（`npm run preview` 後）:

```bash
curl "http://localhost:8787/cdn-cgi/handler/scheduled?cron=0+3+*+*+1"
```

## 2. Resend

### アドレス構成の結論（Gmail は 1つでよい）

自動返信メールの送信元（From）に **Gmail は指定できない**（Resend は DNS 認証済みの自ドメインしか From に使えず、`gmail.com` は認証不可）。
Cloudflare Workers 上では生の SMTP も事実上使えないため、送信はすべて Resend の HTTP API 経由となる。
→ **From は必ずドメインのアドレス**（例 `reservations@onnaton.com`）。ただし**送信専用で受信箱は不要**（Resend で SPF/DKIM を設定するだけ）。
→ **Gmail の役割は受信のみ**。予約通知・お客様の返信・確認メールの手動送信をすべて **1つの Gmail** に集約すると、⑩の5段階フローが1スレッドにまとまり取りこぼしが起きにくい。

| 役割 | 使うアドレス | 環境変数 |
|---|---|---|
| 自動返信メールの From | ドメインのアドレス（送信専用・受信箱不要） | `RESEND_FROM=reservations@onnaton.com` |
| オーナーが予約内容を受け取る宛先 | Gmail（1つ） | `RESEND_OWNER_TO=onnaton.reserve@gmail.com` |
| 自動返信メールの Reply-To | 同じ Gmail | `RESEND_REPLY_TO=onnaton.reserve@gmail.com` |
| オーナーが確認メールを手動送信する時 | 同じ Gmail | （運用のみ・設定不要） |

### 手順

1. **Domains** で送信ドメイン `onnaton.com` を追加
2. 表示された **DNS レコード（SPF / DKIM）** をドメイン管理側に追加（送信元ドメイン認証・1回のみ）
3. 認証完了後 **API Keys** を作成 → `RESEND_API_KEY`
4. 送信元: `RESEND_FROM=reservations@onnaton.com`（**認証済みドメイン必須**。Gmail 不可）
5. 通知先: `RESEND_OWNER_TO=onnaton.reserve@gmail.com`（**Gmail 可**）
6. 返信先: `RESEND_REPLY_TO=onnaton.reserve@gmail.com`（**Gmail 可**・未設定時は `RESEND_OWNER_TO` にフォールバック）
7. これらのキーは **Cloudflare ダッシュボードの Production 変数にも同じ値を設定**する（`RESEND_API_KEY` はシークレット、他は平文で可。`wrangler.jsonc` に `keep_vars: true` があるためデプロイ後も平文変数は維持される）。

※ フォーム送信時:
   - **オーナー**へ新規リクエスト通知
   - **お客様**へ受付確認の自動返信（locale に応じた文面）
   - 予約確定の確認メールは引き続きオーナーが Gmail 等から手動送信

## 3. Cloudflare

1. **Workers & Pages** で GitHub リポジトリ `onnaton-websitev2` を接続  
   またはローカルから `npm run deploy`（要 `wrangler login`）
2. **Workers Builds（Git 連携）の設定**
   - **Build command:** `npm run build`（中で `opennextjs-cloudflare build` → `npx next build`）
   - **Deploy command:** `npx wrangler deploy`
   - ローカルから一発デプロイ: `npm run deploy`（要 `wrangler login`）
3. **Settings → Variables and secrets** に `.env.example` と同じキーを **Production** 用に設定:
   - **平文（Text）**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SITE_SLUG`, `RESEND_FROM`, `RESEND_OWNER_TO`, `RESEND_REPLY_TO`（任意）
   - **シークレット（Encrypt）**: `SUPABASE_SERVICE_ROLE_KEY`, `ONNATON_ADMIN_PASSWORD`, `RESEND_API_KEY`
   - Git 連携で **Build** も使う場合は、同じ `NEXT_PUBLIC_*` を **Build variables** にも追加（ビルド時に埋め込まれるため）
4. **デプロイで変数が消える場合**  
   Wrangler はデフォルトで「設定ファイルが正」として、Dashboard の**平文**変数をデプロイ時に上書き・削除します（**シークレット**は通常残ります）。  
   本リポジトリの `wrangler.jsonc` には `"keep_vars": true` を入れてあるので、**この変更をデプロイした後**は Dashboard で追加した平文変数が維持されます。  
   それ以前に消えた変数は、Dashboard で一度だけ再設定してください。
5. カスタムドメインを Cloudflare に向ける
6. **Security → WAF → Rate limiting rules**（推奨）  
   - `/admin/notices` への POST を IP 単位で制限（アプリ側ロックの二重防御）
7. **Security → Settings → AI bot policies**（2026-09-15 前）  
   - Search クローラーは許可（MEO / Google 検索用）

ローカル確認: `npm run preview`（Workers ランタイム）

## 4. ローカル開発

```bash
cp .env.example .env.local
# .env.local を編集
npm run dev
```

## 5. 複数店舗を増やすとき

`sites` テーブルに行を追加（`slug`, `name`）し、各店舗用に `notices` 3行が自動で欲しい場合は schema の seed 部分を参考に INSERT。

環境変数 `SITE_SLUG` または将来のドメイン→slug マッピングで店舗を切り替えます。
