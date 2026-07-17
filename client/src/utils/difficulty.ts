export function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    case 'hard':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    default:
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }
}
