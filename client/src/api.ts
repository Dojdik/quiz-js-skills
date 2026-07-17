import type { Question, ResultSummary, SubmitResultResponse } from './types';

const API_BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function fetchQuestions() {
  return request<Question[]>('/questions');
}

export function submitResult(body: {
  playerName: string;
  answers: Record<string, number>;
}) {
  return request<SubmitResultResponse>('/results', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchLeaderboard(limit = 10) {
  return request<ResultSummary[]>(`/results?limit=${limit}`);
}
