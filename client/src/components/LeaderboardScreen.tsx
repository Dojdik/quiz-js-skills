import type { ResultSummary } from '../types';

type LeaderboardScreenProps = {
  rows: ResultSummary[];
  onBack: () => void;
};

export function LeaderboardScreen({ rows, onBack }: LeaderboardScreenProps) {
  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl sm:p-8">
      <h2 className="mb-6 text-xl font-semibold text-white">Таблица лидеров</h2>
      {rows.length === 0 ? (
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
              {rows.map((row, i) => (
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
        onClick={onBack}
        className="mt-6 rounded-xl border border-slate-600 px-5 py-2.5 text-slate-200 hover:bg-slate-800"
      >
        ← Назад
      </button>
    </section>
  );
}
