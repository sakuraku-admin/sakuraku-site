# さく楽 予約サイト（公開用パッケージ）

このZIPは **Next.js + Tailwind + Firebase Authentication** でそのままVercelにデプロイできる形にしてあります。

## 1) まずやること（PCにNode.jsが必要）
- Node.js（LTS）をインストールしてください（既に入っていればOK）

## 2) このプロジェクトを起動（ローカル確認）
1. フォルダを開いてターミナルで:
   ```bash
   npm install
   ```
2. `.env.example` をコピーして `.env.local` を作成
3. `.env.local` に Firebase の値を入れる
4. 起動:
   ```bash
   npm run dev
   ```
   -> http://localhost:3000

## 3) GitHubへアップロード
1. GitHub の `sakuraku-site` を開く
2. 「Add file」→「Upload files」
3. このフォルダの中身を全部アップロード（`node_modules`は不要）

## 4) Vercelでデプロイ
1. Vercel → Add New → Project
2. GitHub の `sakuraku-site` を選ぶ
3. 「Environment Variables」に `.env.local` と同じ内容を入れる（NEXT_PUBLIC_ で始まるもの）
4. Deploy

## メモ
- 予約のDB保存（Firestore）は次のステップで追加します。
- 管理画面は今は簡易パスワードですが、本番では管理者ロールに置き換えます。
