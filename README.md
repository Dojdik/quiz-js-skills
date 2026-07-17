# JS Skills Quiz

Квиз-тест на знание JavaScript: React (Vite) + Tailwind CSS на фронте, NestJS + TypeORM + SQLite на бэке.

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | NestJS, TypeORM, better-sqlite3 |
| API | REST (`/api/questions`, `/api/results`) |

## Быстрый старт

### 1. Backend

```bash
cd server
npm install
npm run start:dev
```

API: http://localhost:3000/api  
База: `server/data/quiz.sqlite` (создаётся автоматически, вопросы сидируются при первом запуске).

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

UI: http://localhost:5173  
Прокси Vite перенаправляет `/api` → `http://localhost:3000`.

Из корня:

```bash
npm run dev:server   # терминал 1
npm run dev:client   # терминал 2
```

## API

### `GET /api/questions`

Список вопросов **без** правильных ответов.

### `POST /api/results`

Сохранение результата. Сервер сам считает score по ответам.

```json
{
  "playerName": "Alex",
  "answers": { "1": 0, "2": 1 }
}
```

### `GET /api/results?limit=15`

Таблица лидеров (по проценту и дате).

## Структура

```
quiz-tasks/
├── client/          # React + Vite + Tailwind
├── server/          # NestJS API + SQLite
│   └── data/        # quiz.sqlite
└── package.json     # scripts для monorepo
```
