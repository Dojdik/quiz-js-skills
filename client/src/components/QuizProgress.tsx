type QuizProgressProps = {
  currentIndex: number;
  total: number;
  answeredCount: number;
  progressPercent: number;
};

export function QuizProgress({
  currentIndex,
  total,
  answeredCount,
  progressPercent,
}: QuizProgressProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-400">
        <span>
          Вопрос {currentIndex + 1} / {total}
        </span>
        <span>
          Отвечено: {answeredCount}/{total}
        </span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </>
  );
}
