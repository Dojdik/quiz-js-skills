type WelcomeScreenProps = {
  playerName: string;
  questionsCount: number;
  loading: boolean;
  onPlayerNameChange: (name: string) => void;
  onStart: () => void;
  onShowLeaderboard: () => void;
};

export function WelcomeScreen({
  playerName,
  questionsCount,
  loading,
  onPlayerNameChange,
  onStart,
  onShowLeaderboard,
}: WelcomeScreenProps) {
  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl shadow-black/30 backdrop-blur sm:p-8">
      <h2 className="mb-2 text-xl font-semibold text-white">Добро пожаловать</h2>
      <p className="mb-6 text-slate-400">
        {questionsCount
          ? `${questionsCount} вопросов · результаты сохраняются в PostgreSQL`
          : 'Загрузка вопросов…'}
      </p>
      <label className="mb-2 block text-sm text-slate-300" htmlFor="player-name">
        Ваше имя
      </label>
      <input
        id="player-name"
        type="text"
        value={playerName}
        onChange={(e) => onPlayerNameChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onStart()}
        placeholder="Например, Alex"
        maxLength={100}
        className="mb-6 w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-white outline-none ring-indigo-500 placeholder:text-slate-500 focus:ring-2"
      />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading || !questionsCount}
          onClick={onStart}
          className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Начать квиз
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onShowLeaderboard}
          className="rounded-xl border border-slate-600 px-6 py-3 font-medium text-slate-200 transition hover:border-slate-400 hover:bg-slate-800"
        >
          Рейтинг
        </button>
      </div>
    </section>
  );
}
