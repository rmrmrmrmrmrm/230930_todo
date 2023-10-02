## 公開 URL:

ー

## Github

https://github.com/rmrmrmrmrmrm/230930_todo

## テスト用アカウント

ID ー
Pass ー

## アプリ概要

ToDo

## 作った目的

## 機能

・認証機能（新規登録、サインイン、ログアウト）
・投稿機能（投稿、編集、削除）
・コメント機能（投稿、削除）
・フィルタリング機能
・並び替え機能

## 実装予定機能

ー

## 使用技術

・TypeScript
・React
・Next.js
・storybook

## 画面遷移図

```mermaid
graph LR

  subgraph auth [ ]
    login <--> signin
  end

  subgraph access [アクセス制限]
    logout
    login---->|&nbsp認証&nbsp|top
    top-->edit
    top-->show
  end
```

## ER 図

```mermaid
erDiagram

users ||--o{ posts : ""
users ||--o{ comments: ""
posts ||--o{ comments: ""

users {
 string email "ユーザーemail"
 string password "ユーザーパスワード"
}
posts{
 timestamp Create "作成日"
 string Detail "ToDo詳細"
 string Id "ToDoID"
 string Priority "優先度"
 string Status "状態"
 string Task "タイトル"
 timestamp Update "更新日"
}
comments{
 string Id "ToDoID"
 timestamp commentCreate "コメント作成日"
 string commentDetail "コメント詳細"
 string commentId "コメントID"
 string commentName "コメント記述者"
}
```
