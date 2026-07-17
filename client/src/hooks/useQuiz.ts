import { useCallback, useEffect, useState } from 'react';
import { fetchLeaderboard, fetchQuestions, submitResult } from '../api';
import type {
  Phase,
  Question,
  ResultSummary,
  SubmitResultResponse,
} from '../types';

export function useQuiz() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SubmitResultResponse | null>(null);
  const [leaderboard, setLeaderboard] = useState<ResultSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const current = questions[index];
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [String(current.id)]: optionIndex }));
  };

  const goNext = () => {
    if (index < questions.length - 1) setIndex((i) => i + 1);
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

  const resetToWelcome = () => {
    setPhase('welcome');
    setAnswers({});
    setResult(null);
    setError(null);
  };

  return {
    phase,
    playerName,
    setPlayerName,
    questions,
    index,
    answers,
    result,
    leaderboard,
    loading,
    error,
    startQuiz,
    selectOption,
    goNext,
    goPrev,
    finish,
    showLeaderboard,
    resetToWelcome,
  };
}
