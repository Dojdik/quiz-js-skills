# JS Skills Quiz

Квиз-тест на знание JavaScript: React (Vite) + Tailwind CSS, NestJS + TypeORM + **PostgreSQL**.

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS v4 |
| Backend | NestJS, TypeORM, PostgreSQL |
| Infra | Docker Compose |

## Быстрый старт (Docker)

```bash
cp .env.example .env
docker compose up --build
```

| Сервис | URL |
|--------|-----|
| UI | http://localhost:5173 |
| API | http://localhost:3000/api |
| PostgreSQL | localhost:5432 (`quiz` / `quiz` / db `quiz`) |

Только база:

```bash
docker compose up -d db
```

## Локальная разработка

### 1. PostgreSQL

```bash
docker compose up -d db
```

### 2. Backend

```bash
cd server
cp .env.example .env   # при необходимости
npm install
npm run start:dev
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Vite проксирует `/api` → `http://localhost:3000`.

## API

- `GET /api/questions` — вопросы без правильных ответов
- `POST /api/results` — сохранение результата (`playerName`, `answers`)
- `GET /api/results?limit=15` — рейтинг

## Структура frontend

```
client/src/
├── App.tsx                 # оркестрация экранов
├── api.ts
├── types.ts
├── hooks/useQuiz.ts        # состояние квиза
├── components/
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── WelcomeScreen.tsx
│   ├── QuizScreen.tsx
│   ├── QuestionCard.tsx
│   ├── QuizProgress.tsx
│   ├── ResultScreen.tsx
│   └── LeaderboardScreen.tsx
└── utils/difficulty.ts
```
