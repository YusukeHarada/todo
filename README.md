# Todo

Next.js + Firebase で作ったモバイルファースト PWA のタスク管理アプリ。

## 機能

- Google アカウントでのログイン
- タスクの作成・編集・削除・完了
- カテゴリの作成・編集・削除（カラー付き）
- 優先度（高・中・低）
- 期日の設定と超過表示
- フィルタリング（完了状態・優先度・カテゴリ）・ソート（作成日・期日・優先度）
- ダークモード対応

## 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 認証 | Firebase Auth（Google Sign-in） |
| DB | Firestore |
| スタイル | Tailwind CSS v4 |
| 言語 | TypeScript（strict） |
| テスト | Vitest + happy-dom |

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. Firebase プロジェクトの準備

Firebase Console で以下を有効化する。

- Authentication → Google プロバイダを有効にする
- Firestore Database → 作成する

### 3. 環境変数の設定

`.env.local` を作成して Firebase の設定値を入力する。

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 4. Firestore セキュリティルール

Firebase Console → Firestore → ルール に以下を設定する。

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow create: if request.auth.uid == request.resource.data.userId;
      allow read, update, delete: if request.auth.uid == resource.data.userId;
    }
    match /categories/{categoryId} {
      allow create: if request.auth.uid == request.resource.data.userId;
      allow read, update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## 開発コマンド

```bash
npm run dev        # 開発サーバー起動
npm run build      # プロダクションビルド
npm run test:run   # テスト実行（src/lib/domain/ の純粋関数）
npx tsc --noEmit   # 型チェック
```

## ディレクトリ構成

```
src/
├── app/
│   ├── (auth)/login/        # ログイン画面
│   └── (app)/               # 認証済みページ
│       ├── page.tsx          # タスク一覧
│       ├── tasks/new/        # タスク新規作成
│       ├── tasks/[taskId]/   # タスク詳細・編集
│       └── categories/       # カテゴリ管理
├── components/
│   ├── ui/                   # 汎用UIコンポーネント
│   ├── tasks/                # タスク関連コンポーネント
│   ├── categories/           # カテゴリ関連コンポーネント
│   └── layout/               # レイアウト・ナビゲーション
├── contexts/                 # AuthContext / TasksContext / CategoriesContext
├── lib/
│   ├── firebase/             # Firebase 初期化・Firestoreアクセス層
│   └── domain/               # 純粋関数（フィルタ・ソート・バリデーション）
└── types/                    # Task / Category 型定義
```
