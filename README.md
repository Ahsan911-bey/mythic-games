# 🎮 Mythic Games Store

A production-quality **Gaming Store Web Application** inspired by the Epic Games Store UI, built as a university Database Systems semester project.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 🛍️ Storefront
- **Home Page** — Hero banner, Featured Games, New Releases, Top Selling sections
- **Store Listing** — Browse all games with search by title and category filter pills
- **Game Details** — Full-page hero image, description, price, release date, genre info

### 🔐 Authentication
- Register / Login / Logout
- Simple session-based auth via HTTP cookie (`userId`)
- Role-based access control — **ADMIN** vs **CUSTOMER**

### 🧑‍💻 Customer Features
- **Cart** — Add / remove games, view order summary
- **Checkout** — One-click purchase, atomic transaction creates order + populates library
- **Library** — All purchased games with hover-play overlay

### 🛠️ Admin Panel (`/admin`)
- **Dashboard** — Total users, games, orders, revenue + recent orders
- **Manage Games** — Full CRUD: add games, toggle featured status (controls homepage), delete
- **All Orders** — View all customer purchases with itemized breakdown
- **SQL Terminal** — Live Linux-style terminal to run raw SQL queries against the database

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Server Actions) |
| Database | MySQL 8 (Docker) |
| ORM | Prisma 6 |
| Styling | Tailwind CSS v4 + custom CSS variables |
| Auth | Cookie-based sessions (plain text, for demo) |
| Icons | Lucide React |
| Containerization | Docker Compose (MySQL only) |

---

## 🗄️ Database Schema

```
User          ─┬─< CartItem >─┬─ Game ─< OrderItem >─ Order
               │              │    │
               └─────────────┼────┴─< UserLibrary
                              │
                         Category
```

**Models:** `User`, `Category`, `Game`, `CartItem`, `Order`, `OrderItem`, `UserLibrary`

**Key relationships:**
- `Game` belongs to one `Category`
- `CartItem` links `User` ↔ `Game`
- `Order` has many `OrderItem`s (stores price at time of purchase)
- `UserLibrary` tracks owned games per user (unique per user+game)

---

## 📁 Project Structure

```
mythic-games/
├── app/
│   ├── actions/          # Server Actions (auth, cart, games)
│   ├── admin/            # Admin pages (dashboard, games, orders)
│   ├── api/admin/sql/    # Raw SQL execution API route
│   ├── cart/             # Cart page
│   ├── games/            # Store listing + game detail ([id])
│   ├── library/          # User library page
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── globals.css       # Design system + Tailwind config
│   ├── layout.tsx        # Root layout with Navbar + Footer
│   └── page.tsx          # Home page
├── components/
│   ├── admin/
│   │   └── SqlTerminal.tsx   # Linux-style SQL terminal
│   ├── GameCard.tsx          # Game card with hover effects
│   ├── HeroBanner.tsx        # Home hero section
│   └── Navbar.tsx            # Sticky navigation bar
├── lib/
│   ├── auth.ts           # Session cookie helpers
│   └── prisma.ts         # Prisma client singleton
├── prisma/
│   ├── schema.prisma     # Full database schema
│   └── seed.ts           # Sample data seed script
└── docker-compose.yml    # MySQL database container
```

---

## 🚀 First Time Setup

> The database runs in Docker. The Next.js app runs locally.

**Prerequisites:** [Node.js 20+](https://nodejs.org) · [Docker Desktop](https://www.docker.com/products/docker-desktop)

**1. Install dependencies**
```bash
npm install
```

**2. Start the database**
```bash
docker compose up -d
```
> Starts a MySQL 8 container on port `3306`.

**3. Sync the schema** *(first time only)*
```bash
npx prisma db push
```

**4. Seed dummy data** *(first time only)*
```bash
npx prisma db seed
```

**5. Start the server**
```bash
npm run dev
```

Then visit **http://localhost:3000**

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@mythicgames.com` | `adminpassword` |
| Customer | Register via `/register` | (your choice) |

---

## 🗺️ Pages Reference

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home — Hero, Featured, New Releases | Public |
| `/games` | Full store listing with search + filter | Public |
| `/games/[id]` | Game detail page | Public |
| `/login` | Sign in | Public |
| `/register` | Create account | Public |
| `/cart` | Shopping cart | Auth |
| `/library` | Purchased games | Auth |
| `/admin` | Dashboard overview | Admin |
| `/admin/games` | Manage game catalog | Admin |
| `/admin/orders` | View all orders | Admin |

---

## 🖥️ Admin SQL Terminal

Inside any `/admin` page, click the **SQL Terminal** button (bottom-right corner) to open a live Linux-style terminal.

**Supported commands:**

| Command | Description |
|---------|-------------|
| `SELECT * FROM User;` | Run any SELECT query |
| `SHOW TABLES;` | List all database tables |
| `DESCRIBE Game;` | Show table structure |
| `/` | List all models from `schema.prisma` |
| `clear` | Clear the terminal screen |
| ↑ / ↓ | Navigate command history |

> ⚠️ No query restrictions — all raw SQL is executed directly on the database.

---

## 🌱 Re-seeding the Database

If you need to reset and re-seed:
```bash
# Drop all tables and re-push schema
npx prisma db push --force-reset

# Re-seed with sample data
npx prisma db seed
```

---

## 🎨 Design System

The UI is built on a custom design system defined in `app/globals.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0B0F19` | Page background |
| `--surface` | `#111827` | Cards, panels |
| `--brand` | `#7C3AED` | Primary accent (purple) |
| `--brand-light` | `#9D68FF` | Hover states, prices |
| `--text-primary` | `#FFFFFF` | Headings |
| `--text-secondary` | `#9CA3AF` | Body text |
| `--text-muted` | `#6B7280` | Labels, metadata |

---

## 📝 Environment Variables

```env
# .env
DATABASE_URL="mysql://root:root@localhost:3306/gamestore"
```

> The app connects to MySQL running in Docker on `localhost:3306`. Keep this value as-is for local development.

---

## 👨‍💻 Built For

University **Database Systems** Semester Project demonstrating:
- Clean relational schema design with foreign keys and cascade rules
- Full CRUD operations via Prisma ORM
- Table joins through Prisma's `include` / `select` API
- Case-insensitive search with Prisma `contains`
- Raw SQL execution with `$queryRawUnsafe` / `$executeRawUnsafe`
- Docker containerization with MySQL persistence
