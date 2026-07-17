# JS Skills Quiz

Квиз-тест на знание **JavaScript**: вопросы по типам, coercion, массивам, замыканиям, async/await, event loop, scope и другим темам.

Результаты прохождений сохраняются в **PostgreSQL**. Правильные ответы на клиент не отдаются — score считает сервер.

---

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS v4 |
| Backend | NestJS, TypeORM, class-validator |
| Database | PostgreSQL 16 (`jsonb` для options/answers) |
| Infra | Docker Compose (db + api + client) |

---

## Возможности

- Приветственный экран с именем игрока
- 15 вопросов с категориями и уровнем сложности
- Прогресс, навигация «Назад / Далее»
- Подсчёт и сохранение результата в БД
- Таблица лидеров
- Seed вопросов при первом запуске API

---

## Быстрый старт (Docker)

Полный стек (PostgreSQL + API + UI):

```bash
cp .env.example .env   # опционально, есть значения по умолчанию
docker compose up --build
```

| Сервис | URL / подключение |
|--------|-------------------|
| UI | http://localhost:5173 |
| API | http://localhost:3000/api |
| PostgreSQL | `localhost:5432` · user/password/db: `quiz` / `quiz` / `quiz` |

Остановка:

```bash
docker compose down
```

Только база (для локальной разработки frontend/backend на хосте):

```bash
docker compose up -d db
```

---

## Локальная разработка

Нужны **Node.js 20+**, **npm** и **Docker** (для PostgreSQL).

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

API: http://localhost:3000/api

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

UI: http://localhost:5173

Vite проксирует запросы `/api` → `http://localhost:3000` (см. `client/vite.config.ts`).

### Скрипты из корня

```bash
npm run dev:server    # NestJS watch
npm run dev:client    # Vite dev
npm run build:server
npm run build:client
npm run start:server  # production (после build)
```

---

## Переменные окружения

### Корень (`.env` / `.env.example`) — Docker Compose

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `POSTGRES_USER` | `quiz` | Пользователь PostgreSQL |
| `POSTGRES_PASSWORD` | `quiz` | Пароль |
| `POSTGRES_DB` | `quiz` | Имя БД |
| `POSTGRES_PORT` | `5432` | Порт на хосте |
| `API_PORT` | `3000` | Порт API на хосте |
| `CLIENT_PORT` | `5173` | Порт UI на хосте |
| `CORS_ORIGIN` | `http://localhost:5173` | Разрешённые origin (через запятую) |
| `VITE_API_URL` | `http://localhost:3000` | Базовый URL API при сборке client-образа |

### Backend (`server/.env`)

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `PORT` | `3000` | Порт NestJS |
| `DB_HOST` | `localhost` | Хост БД (`db` внутри Compose) |
| `DB_PORT` | `5432` | Порт БД |
| `DB_USER` | `quiz` | Пользователь |
| `DB_PASSWORD` | `quiz` | Пароль |
| `DB_NAME` | `quiz` | База |
| `CORS_ORIGIN` | `http://localhost:5173` | CORS |

### Frontend

| Переменная | Описание |
|------------|----------|
| `VITE_API_URL` | Если задана — запросы идут на `{VITE_API_URL}/api`. Если нет — относительный путь `/api` (прокси Vite / nginx). |

---

## API

Префикс: `/api`

### `GET /questions`

Список вопросов **без** `correctIndex`.

```json
[
  {
    "id": 1,
    "text": "Что выведет `console.log(typeof null)`?",
    "options": ["\"null\"", "\"object\"", "\"undefined\"", "\"number\""],
    "category": "types",
    "difficulty": "easy"
  }
]
```

### `POST /results`

Сохранение результата. Сервер сам считает `score` / `percentage`.

**Тело запроса:**

```json
{
  "playerName": "Alex",
  "answers": {
    "1": 1,
    "2": 0
  }
}
```

`answers` — объект `questionId → индекс выбранного варианта`.

**Ответ (фрагмент):**

```json
{
  "id": 1,
  "playerName": "Alex",
  "score": 14,
  "total": 15,
  "percentage": 93.33,
  "createdAt": "2026-07-17T20:00:00.000Z",
  "breakdown": [
    {
      "questionId": 1,
      "correct": true,
      "correctIndex": 1,
      "selectedIndex": 1
    }
  ]
}
```

### `GET /results?limit=15`

Таблица лидеров (сортировка: `percentage` DESC, затем `createdAt` DESC). Без поля `answers`.

### `GET /results/:id`

Один результат по id.

---

## Структура проекта

```
quiz-tasks/
├── docker-compose.yml      # db, api, client
├── .env.example
├── package.json            # удобные scripts monorepo
├── client/                 # React + Vite + Tailwind
│   ├── Dockerfile
│   ├── nginx.conf          # SPA + proxy /api → api
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── api.ts
│       ├── types.ts
│       ├── hooks/useQuiz.ts
│       ├── components/
│       └── utils/difficulty.ts
└── server/                 # NestJS API
    ├── Dockerfile
    ├── .env.example
    └── src/
        ├── main.ts
        ├── app.module.ts
        ├── entities/       # TypeORM-схемы (Question, Result)
        ├── seeds/          # начальные данные (questions.seed)
        ├── questions/      # list API
        └── results/        # DTO, save + leaderboard
```

### Frontend (компоненты)

| Файл | Назначение |
|------|------------|
| `App.tsx` | Оркестрация фаз (welcome / quiz / result / leaderboard) |
| `hooks/useQuiz.ts` | Состояние квиза и вызовы API |
| `components/Layout.tsx` | Общий layout, ошибки, footer |
| `components/Header.tsx` | Заголовок |
| `components/WelcomeScreen.tsx` | Имя и старт |
| `components/QuizScreen.tsx` | Экран прохождения |
| `components/QuestionCard.tsx` | Вопрос и варианты |
| `components/QuizProgress.tsx` | Прогресс-бар |
| `components/ResultScreen.tsx` | Итог и breakdown |
| `components/LeaderboardScreen.tsx` | Рейтинг |

### Backend (модули)

| Модуль | Назначение |
|--------|------------|
| `QuestionsModule` | Сущность `questions`, seed, `GET /questions` |
| `ResultsModule` | Сущность `results`, `POST/GET /results` |
| TypeORM | `synchronize: true` в dev — схема создаётся автоматически |

---

## Схема БД (упрощённо)

**questions**

| Поле | Тип | Описание |
|------|-----|----------|
| id | serial PK | |
| text | text | Текст вопроса |
| options | jsonb | Массив строк-вариантов |
| correctIndex | int | Индекс верного ответа |
| category | varchar | Категория |
| difficulty | varchar | easy / medium / hard |

**results**

| Поле | Тип | Описание |
|------|-----|----------|
| id | serial PK | |
| playerName | varchar(100) | Имя |
| score | int | Число верных |
| total | int | Всего вопросов |
| percentage | float | 0–100 |
| answers | jsonb | Карта выбранных ответов |
| createdAt | timestamp | Время сохранения |

---

## Публичный API (Caddy + HTTPS)

Домен: **https://quiz-api.185.164.138.113.sslip.io**

Caddy в Docker проксирует HTTP/HTTPS → Nest API. Let's Encrypt (`:80` + `:443`, редирект HTTP→HTTPS).

```bash
docker compose up -d caddy api
# проверка
curl https://quiz-api.185.164.138.113.sslip.io/api/questions
```

Конфиг: `caddy/Caddyfile`. Сертификаты в volume `caddy_data`.

---

## Деплой frontend на Vercel

На Vercel выкладывается **только клиент** (`client/`). NestJS + PostgreSQL остаются на своём хостинге (Railway, Render, VPS, Docker и т.д.).

### Скрипт

```bash
# preview
./scripts/deploy-vercel.sh
# или
npm run deploy:vercel

# production
./scripts/deploy-vercel.sh --prod --api-url https://your-api.example.com
# или
VITE_API_URL=https://your-api.example.com npm run deploy:vercel:prod
```

Требования: аккаунт Vercel, CLI (`npx vercel` / `vercel login`).

| Опция | Описание |
|-------|----------|
| `--prod` | Production deploy |
| `--yes` | Без интерактивных вопросов |
| `--api-url URL` | `VITE_API_URL` на время сборки |
| `--token TOKEN` | Токен для CI (`VERCEL_TOKEN`) |

Конфиг SPA: `client/vercel.json`.

### После деплоя

1. В NestJS укажите `CORS_ORIGIN` с доменом Vercel (например `https://your-app.vercel.app`).
2. В Vercel Dashboard → Environment Variables добавьте `VITE_API_URL` для git-деплоев.
3. API должен быть доступен по HTTPS из браузера.

### CI (пример)

```bash
export VERCEL_TOKEN=...
export VITE_API_URL=https://api.example.com
./scripts/deploy-vercel.sh --prod --yes
```

---

## Полезные команды Docker

```bash
# логи
docker compose logs -f api
docker compose logs -f db

# пересборка без кэша
docker compose build --no-cache

# удалить контейнеры и volume БД (данные пропадут)
docker compose down -v
```

---

## Лицензия

Учебный / демо-проект.
