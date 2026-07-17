import type { SubmitResultResponse } from '../types';

type ResultScreenProps = {
  result: SubmitResultResponse;
  onRetry: () => void;
  onShowLeaderboard: () => void;
};

export function ResultScreen({
  result,
  onRetry,
  onShowLeaderboard,
}: ResultScreenProps) {
  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 text-center shadow-xl sm:p-8">
      <p className="text-sm text-slate-400">Результат сохранён в PostgreSQL</p>
      <h2 className="mt-2 text-2xl font-bold text-white">{result.playerName}</h2>
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
          onClick={onRetry}
          className="rounded-xl bg-indigo-500 px-5 py-2.5 font-semibold text-white hover:bg-indigo-400"
        >
          Пройти снова
        </button>
        <button
          type="button"
          onClick={onShowLeaderboard}
          className="rounded-xl border border-slate-600 px-5 py-2.5 text-slate-200 hover:bg-slate-800"
        >
          Рейтинг
        </button>
      </div>
    </section>
  );
}
