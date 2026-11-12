# Library Management System

NestJS + Prisma + PostgreSQL (Neon) backend for a library book catalog.

## Setup

```bash
cd api
npm install
cp .env.example .env      # then put your real DATABASE_URL in .env
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

## Schema Decisions

**Why Book references Genre instead of embedding it**

Each `Book` stores a `genreId` foreign key pointing to a row in the `Genre`
table, rather than copying the genre's data into every book record.

- **Single source of truth:** a genre's name or description lives in one row.
  Renaming "Sci-Fi" to "Science Fiction" is one update, not an update across
  hundreds of books.
- **No duplication or drift:** embedding would let the same genre be spelled
  differently on different books ("Fantasy", "fantasy", "Fantasy ").
- **Integrity enforced by the database:** the foreign key means a book cannot
  point to a genre that doesn't exist.
- **Queryable both ways:** relations let us efficiently list all books in a
  genre, or fetch a book with its genre via `include`.
- **Genres are shared, reusable entities** with their own lifecycle, so they
  are a natural separate model rather than part of a book.

**Other decisions**

- `Role` is an enum (`PATRON`, `LIBRARIAN`), so invalid roles are rejected by
  the database. It defaults to `PATRON`, the least-privileged option.
- `Review` links `Book` and `User` with `@@unique([bookId, userId])`, so each
  user can review a book only once.

## Prisma vs. a document database

Coming from a document database like MongoDB, the biggest difference was that
the structure has to be defined up front and changed through migrations. In a
document DB I could have embedded the genre in each book and changed the shape
later. With Prisma, the schema is the source of truth and relations are
enforced for me, which felt stricter but safer.
