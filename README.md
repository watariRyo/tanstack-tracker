
# Tracker

TanStack Startを試すための収支管理プロジェクト。

## 🚀 技術スタック

### Core Framework
- **[TanStack Start](https://tanstack.com/start)** - Full-stack React framework with file-based routing
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server

### Routing & Data Fetching
- **[TanStack Router](https://tanstack.com/router)** - Type-safe file-based routing
- **[TanStack Router Devtools](https://tanstack.com/router/latest/docs/framework/react/devtools)** - Development tools for debugging routes

### Authentication
- **[Clerk](https://clerk.com/)** - Complete authentication solution with user management
  - `@clerk/tanstack-react-start` - TanStack Start integration

### UI Components & Styling
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Shadcn/ui](https://ui.shadcn.com/)** - Re-usable component collection

### Database & ORM
- **[Kysely](https://kysely.dev/)** - Type-safe SQL query builder
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
  - `pg` - PostgreSQL client for Node.js

### Form Management
- **[Zod](https://zod.dev/)** - Schema validation

### Server & Build
- **[@tanstack/react-start](https://tanstack.com/start)** - Server-side rendering and API routes

### Lint & Formatter
- **[Biome](https://biomejs.dev/)** - Fast linter and formatter (replaces ESLint + Prettier)

## 📦 Getting Started

### Prerequisites
- Node.js 24.13.1
- npm or pnpm
- PostgreSQL database

### Installation

```bash
# Install dependencies
npm install

# 環境変数設定（Clerkはユーザー登録が必要）
cp .env.example .env

# データベースマイグレーション
# 要dockerディレクトリからコンテナ起動
npm run db:migrate

# サーバ起動
npm run dev

```

## 参考
デザインの大部分を以下参考にしている。  
https://www.udemy.com/course/tanstack-start-react-js-korean/

shadcnに一部大きな変更があったり、TanStack側にも更新が入っている。  
Drizzleを使いたくなかったり、postgreSQLをローカルに構築したりと差分あり。
