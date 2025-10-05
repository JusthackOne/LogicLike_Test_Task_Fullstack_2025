*LogicLike_Тестовое задание Fullstack*

- Backend: Node.js + TypeScript + Express + PostgreSQL
- Frontend: React + Vite + Tailwind (shadcn‑style UI components)
- Deploy: Docker + docker-compose

**Структура**
- `backend/` — API, миграции, сиды.
- `frontend/` — React SPA.
- `docker-compose.yml` — БД, backend, frontend.

**Запуск через Docker**
- Требования: Docker, docker-compose.
- Команда: `docker compose up --build`
- Откройте: `http://localhost:5173`
- API: `http://localhost:4000/api`

Сервис сам применяет миграции и один раз наполняет БД базовыми идеями (seed-файл пропускается, если таблица не пустая).

**Переменные окружения**
- Backend: см. `backend/.env.example`. По умолчанию в compose:
  - `DB_HOST=db`, `DB_PORT=5432`, `DB_USER=app`, `DB_PASSWORD=app`, `DB_NAME=app`, `PORT=4000`.
- Frontend: `VITE_API_BASE_URL` пробрасывается как ARG на этапе сборки образа (см. `frontend/Dockerfile`). В `docker-compose.yml` — `http://backend:4000/api`.

**База данных**
- Таблицы:
  - `ideas(id, title, description, vote_count, created_at)`
  - `votes(id, idea_id, voter_ip inet, created_at)` с уникальным ограничением `(idea_id, voter_ip)` + индексы по `voter_ip`, `idea_id`.
- Миграции: `backend/src/db/migrations/*.sql` и раннер `backend/src/db/migrate.ts`.
- Seed: `backend/src/seed/seed.ts` — добавляет ~10 идей при пустой таблице `ideas`.

**API**
- `GET /api/ideas` → `{ items: [{ id, title, description, voteCount, hasVoted }], votesUsed, votesLimit }`.
- `POST /api/ideas/:id/vote` → `201` если успешно. Ошибки: `409 { error: "ALREADY_VOTED" }` или `409 { error: "VOTE_LIMIT_REACHED" }`, `404` если идея не найдена.
- `DELETE /api/ideas/:id/vote` → снимает голос, `404` если голоса не было.

IP извлекается из `X-Forwarded-For` (первый адрес) или из `remoteAddress`. Express настроен с `trust proxy`.

**Локальная разработка (без Docker)**
1) PostgreSQL локально: создайте БД `app` и пользователя `app/app`, или используйте `DATABASE_URL`.
2) Backend:
   - `cd backend`
   - `cp .env.example .env` и поправьте при необходимости
   - `npm install`
   - `npm run build && npm run migrate && npm run seed`
   - `npm run start` (или `npm run dev` для watch)
3) Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev` → `http://localhost:5173`
   - Убедитесь, что `VITE_API_BASE_URL=http://localhost:4000/api`

**Команды**
- Compose: `docker compose up --build`
- Backend (dev): `npm run dev`
- Backend (prod): `npm run build && npm run start:prod`
- Frontend (dev): `npm run dev`
- Миграции вручную: `npm run migrate`
- Сид: `npm run seed`
