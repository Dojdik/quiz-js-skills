export type Question = {
  id: number;
  text: string;
  options: string[];
  category: string;
  difficulty: string;
};

export type ResultSummary = {
  id: number;
  playerName: string;
  score: number;
  total: number;
  percentage: number;
  createdAt: string;
};

export type SubmitResultResponse = {
  id: number;
  playerName: string;
  score: number;
  total: number;
  percentage: number;
  createdAt: string;
  breakdown: {
    questionId: number;
    correct: boolean;
    correctIndex: number;
    selectedIndex: number | null;
  }[];
};
