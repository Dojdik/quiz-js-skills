import type { Question } from '../types';
import { QuestionCard } from './QuestionCard';
import { QuizProgress } from './QuizProgress';

type QuizScreenProps = {
  questions: Question[];
  index: number;
  answers: Record<string, number>;
  loading: boolean;
  onSelectOption: (optionIndex: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function QuizScreen({
  questions,
  index,
  answers,
  loading,
  onSelectOption,
  onPrev,
  onNext,
  onFinish,
}: QuizScreenProps) {
  const current = questions[index];
  if (!current) return null;

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;
  const isLast = index === questions.length - 1;
  const allAnswered = answeredCount >= questions.length;

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl shadow-black/30 sm:p-8">
      <QuizProgress
        currentIndex={index}
        total={questions.length}
        answeredCount={answeredCount}
        progressPercent={progressPercent}
      />

      <QuestionCard
        question={current}
        selectedIndex={answers[String(current.id)]}
        onSelect={onSelectOption}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm text-slate-200 disabled:opacity-40"
        >
          ← Назад
        </button>
        <div className="flex gap-2">
          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Далее →
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !allAnswered}
              onClick={onFinish}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Сохранение…' : 'Завершить и сохранить'}
            </button>
          )}
        </div>
      </div>
      {isLast && !allAnswered && (
        <p className="mt-3 text-center text-xs text-amber-300/90">
          Ответьте на все вопросы, чтобы завершить
        </p>
      )}
    </section>
  );
}
