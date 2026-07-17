import {
  Layout,
  LeaderboardScreen,
  QuizScreen,
  ResultScreen,
  WelcomeScreen,
} from './components';
import { useQuiz } from './hooks/useQuiz';

export default function App() {
  const quiz = useQuiz();

  return (
    <Layout error={quiz.error}>
      {quiz.phase === 'welcome' && (
        <WelcomeScreen
          playerName={quiz.playerName}
          questionsCount={quiz.questions.length}
          loading={quiz.loading}
          onPlayerNameChange={quiz.setPlayerName}
          onStart={quiz.startQuiz}
          onShowLeaderboard={() => void quiz.showLeaderboard()}
        />
      )}

      {quiz.phase === 'quiz' && (
        <QuizScreen
          questions={quiz.questions}
          index={quiz.index}
          answers={quiz.answers}
          loading={quiz.loading}
          onSelectOption={quiz.selectOption}
          onPrev={quiz.goPrev}
          onNext={quiz.goNext}
          onFinish={() => void quiz.finish()}
        />
      )}

      {quiz.phase === 'result' && quiz.result && (
        <ResultScreen
          result={quiz.result}
          onRetry={quiz.resetToWelcome}
          onShowLeaderboard={() => void quiz.showLeaderboard()}
        />
      )}

      {quiz.phase === 'leaderboard' && (
        <LeaderboardScreen
          rows={quiz.leaderboard}
          onBack={quiz.resetToWelcome}
        />
      )}
    </Layout>
  );
}
