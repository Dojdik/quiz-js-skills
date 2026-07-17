import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchLeaderboard, fetchQuestions, submitResult } from './api';
import type { Question, ResultSummary, SubmitResultResponse } from './types';

type Phase = 'welcome' | 'quiz' | 'result' | 'leaderboard';

function difficultyColor(d: string) {
  switch (d) {
    case 'easy':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    case 'hard':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    default:
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SubmitResultResponse | null>(null);
  const [leaderboard, setLeaderboard] = useState<ResultSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = questions[index];
  const progress = questions.length
    ? Math.round((Object.keys(answers).length / questions.length) * 100)
    : 0;

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить вопросы');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const startQuiz = () => {
    if (!playerName.trim()) {
      setError('Введите имя');
      return;
    }
    setError(null);
    setAnswers({});
    setIndex(0);
    setResult(null);
    setPhase('quiz');
  };

  const selectOption = (optionIndex: number) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [String(current.id)]: optionIndex }));
  };

  const goNext = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitResult({
        playerName: playerName.trim(),
        answers,
      });
      setResult(res);
      setPhase('result');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения результата');
    } finally {
      setLoading(false);
    }
  };

  const showLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchLeaderboard(15);
      setLeaderboard(rows);
      setPhase('leaderboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки рейтинга');
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6">
        <header className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
            JavaScript Skills
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Quiz Test
          </h1>
          <p className="mt-2 text-slate-400">
            Проверьте знания JS: типы, async, scope, event loop и другое
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {phase === 'welcome' && (
          <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl shadow-black/30 backdrop-blur sm:p-8">
            <h2 className="mb-2 text-xl font-semibold text-white">
              Добро пожаловать
            </h2>
            <p className="mb-6 text-slate-400">
              {questions.length
                ? `${questions.length} вопросов · результаты сохраняются в БД`
                : 'Загрузка вопросов…'}
            </p>
            <label className="mb-2 block text-sm text-slate-300">Ваше имя</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
              placeholder="Например, Alex"
              maxLength={100}
              className="mb-6 w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-white outline-none ring-indigo-500 placeholder:text-slate-500 focus:ring-2"
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={loading || !questions.length}
                onClick={startQuiz}
                className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Начать квиз
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => void showLeaderboard()}
                className="rounded-xl border border-slate-600 px-6 py-3 font-medium text-slate-200 transition hover:border-slate-400 hover:bg-slate-800"
              >
                Рейтинг
              </button>
            </div>
          </section>
        )}

        {phase === 'quiz' && current && (
          <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl shadow-black/30 sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-400">
              <span>
                Вопрос {index + 1} / {questions.length}
              </span>
              <span>
                Отвечено: {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyColor(current.difficulty)}`}
              >
                {current.difficulty}
              </span>
              <span className="rounded-full border border-slate-600 px-2.5 py-0.5 text-xs text-slate-300">
                {current.category}
              </span>
            </div>

            <h2 className="mb-6 text-left text-lg font-semibold leading-snug text-white sm:text-xl">
              {current.text}
            </h2>

            <ul className="mb-8 space-y-3">
              {current.options.map((opt, i) => {
                const selected = answers[String(current.id)] === i;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => selectOption(i)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        selected
                          ? 'border-indigo-400 bg-indigo-500/20 text-white ring-2 ring-indigo-400/50'
                          : 'border-slate-600 bg-slate-800/50 text-slate-200 hover:border-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700/80 text-xs font-bold text-slate-300">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={index === 0}
                className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm text-slate-200 disabled:opacity-40"
              >
                ← Назад
              </button>
              <div className="flex gap-2">
                {index < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
                  >
                    Далее →
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading || answeredCount < questions.length}
                    onClick={() => void finish()}
                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Сохранение…' : 'Завершить и сохранить'}
                  </button>
                )}
              </div>
            </div>
            {answeredCount < questions.length && index === questions.length - 1 && (
              <p className="mt-3 text-center text-xs text-amber-300/90">
                Ответьте на все вопросы, чтобы завершить
              </p>
            )}
          </section>
        )}

        {phase === 'result' && result && (
          <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 text-center shadow-xl sm:p-8">
            <p className="text-sm text-slate-400">Результат сохранён в БД</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {result.playerName}
            </h2>
            <div className="my-6 inline-flex flex-col items-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-10 py-6">
              <span className="text-5xl font-bold text-indigo-300">
                {result.percentage}%
              </span>
              <span className="mt-2 text-slate-300">
                {result.score} из {result.total} верно
              </span>
            </div>

            <ul className="mb-8 max-h-64 space-y-2 overflow-y-auto text-left text-sm">
              {result.breakdown.map((b, i) => (
                <li
                  key={b.questionId}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                    b.correct
                      ? 'bg-emerald-500/10 text-emerald-200'
                      : 'bg-rose-500/10 text-rose-200'
                  }`}
                >
                  <span className="font-mono text-xs opacity-70">#{i + 1}</span>
                  {b.correct ? 'Верно' : 'Неверно'}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhase('welcome');
                  setAnswers({});
                  setResult(null);
                }}
                className="rounded-xl bg-indigo-500 px-5 py-2.5 font-semibold text-white hover:bg-indigo-400"
              >
                Пройти снова
              </button>
              <button
                type="button"
                onClick={() => void showLeaderboard()}
                className="rounded-xl border border-slate-600 px-5 py-2.5 text-slate-200 hover:bg-slate-800"
              >
                Рейтинг
              </button>
            </div>
          </section>
        )}

        {phase === 'leaderboard' && (
          <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Таблица лидеров
            </h2>
            {leaderboard.length === 0 ? (
              <p className="text-slate-400">Пока нет результатов</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="pb-3 pr-2 font-medium">#</th>
                      <th className="pb-3 pr-2 font-medium">Игрок</th>
                      <th className="pb-3 pr-2 font-medium">Счёт</th>
                      <th className="pb-3 font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((row, i) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-800 text-slate-200"
                      >
                        <td className="py-3 pr-2 text-slate-500">{i + 1}</td>
                        <td className="py-3 pr-2 font-medium">{row.playerName}</td>
                        <td className="py-3 pr-2">
                          {row.score}/{row.total}
                        </td>
                        <td className="py-3 font-semibold text-indigo-300">
                          {row.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              type="button"
              onClick={() => setPhase('welcome')}
              className="mt-6 rounded-xl border border-slate-600 px-5 py-2.5 text-slate-200 hover:bg-slate-800"
            >
              ← Назад
            </button>
          </section>
        )}

        <footer className="mt-auto pt-10 text-center text-xs text-slate-600">
          React + Vite · NestJS · Tailwind · SQLite
        </footer>
      </div>
    </div>
  );
}
