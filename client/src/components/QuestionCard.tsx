import type { Question } from '../types';
import { difficultyColor } from '../utils/difficulty';

type QuestionCardProps = {
  question: Question;
  selectedIndex: number | undefined;
  onSelect: (optionIndex: number) => void;
};

export function QuestionCard({
  question,
  selectedIndex,
  onSelect,
}: QuestionCardProps) {
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyColor(question.difficulty)}`}
        >
          {question.difficulty}
        </span>
        <span className="rounded-full border border-slate-600 px-2.5 py-0.5 text-xs text-slate-300">
          {question.category}
        </span>
      </div>

      <h2 className="mb-6 text-left text-lg font-semibold leading-snug text-white sm:text-xl">
        {question.text}
      </h2>

      <ul className="mb-8 space-y-3">
        {question.options.map((opt, i) => {
          const selected = selectedIndex === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onSelect(i)}
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
    </>
  );
}
