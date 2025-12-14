import { motion } from 'framer-motion';
import { Download, PartyPopper, Trophy, Star, ArrowLeft } from 'lucide-react';
import PixelButton from './PixelButton';
import { useState } from 'react';

interface QuestionData {
  id: string;
  text: string;
  order_index: number;
}

interface AnswerData {
  id: string;
  question_id: string;
  text: string;
  author_nickname: string;
}

interface VictoryScreenProps {
  roomName: string;
  participantCount: number;
  questionCount: number;
  answerCount: number;
  theme: 'christmas' | 'horse';
  questions: QuestionData[];
  answers: AnswerData[];
  onDownloadPDF: () => Promise<void>;
  onBackToQuestions: () => void;
}

const VictoryScreen = ({
  roomName,
  participantCount,
  questionCount,
  answerCount,
  theme,
  questions,
  answers,
  onDownloadPDF,
  onBackToQuestions,
}: VictoryScreenProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownloadPDF();
    } finally {
      setIsDownloading(false);
    }
  };

  // Get answers for a specific question
  const getAnswersForQuestion = (questionId: string) => {
    return answers.filter(a => a.question_id === questionId);
  };

  // Floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    size: 8 + Math.random() * 16,
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay with gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-background/95 backdrop-blur-sm"
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '100vh', x: `${p.x}vw`, opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
          className="fixed pointer-events-none"
          style={{ fontSize: p.size }}
        >
          {theme === 'christmas' ? (
            ['🎄', '⭐', '🎁', '❄️', '🔔'][p.id % 5]
          ) : (
            ['🐴', '🧧', '🌅', '✨', '🎊'][p.id % 5]
          )}
        </motion.div>
      ))}

      {/* Main content - scrollable */}
      <div className="relative z-10 min-h-screen p-4 sm:p-8">
        {/* Back button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={onBackToQuestions}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          다시 둘러보기
        </motion.button>

        {/* Header section */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
          className="pixel-card max-w-2xl mx-auto text-center mb-8 overflow-hidden"
        >
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-secondary" />

          {/* Trophy icon with animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.4, damping: 10 }}
            className="mb-4"
          >
            <div className="relative inline-block">
              <Trophy className="w-16 h-16 text-accent mx-auto" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <Star className="w-6 h-6 text-secondary fill-secondary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Victory text */}
          <h1 className="font-dnf text-2xl sm:text-3xl text-accent mb-2 pixel-text-shadow">
            축하합니다!
          </h1>
          <p className="text-base text-secondary font-dnf mb-4">
            {roomName} - 모든 언박싱 완료!
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-dnf text-xl text-accent">{participantCount}</div>
              <div className="text-muted-foreground text-xs">참여자</div>
            </div>
            <div className="text-center">
              <div className="font-dnf text-xl text-secondary">{questionCount}</div>
              <div className="text-muted-foreground text-xs">질문</div>
            </div>
            <div className="text-center">
              <div className="font-dnf text-xl text-primary">{answerCount}</div>
              <div className="text-muted-foreground text-xs">답변</div>
            </div>
          </div>
        </motion.div>

        {/* All questions and answers */}
        <div className="max-w-2xl mx-auto space-y-6">
          {questions
            .sort((a, b) => a.order_index - b.order_index)
            .map((question, qIndex) => (
              <motion.div
                key={question.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + qIndex * 0.1 }}
                className="pixel-card"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="font-dnf text-accent text-lg shrink-0">
                    Q{qIndex + 1}
                  </span>
                  <h3 className="text-foreground leading-relaxed">
                    {question.text}
                  </h3>
                </div>

                <div className="space-y-3 pl-8">
                  {getAnswersForQuestion(question.id).map((answer) => (
                    <div
                      key={answer.id}
                      className="bg-muted/50 p-3 border-l-2 border-accent"
                    >
                      <p className="text-foreground text-sm mb-1">
                        {answer.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        — {answer.author_nickname}
                      </p>
                    </div>
                  ))}

                  {getAnswersForQuestion(question.id).length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      답변이 없습니다
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
        </div>

        {/* PDF Download section at bottom */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 + questions.length * 0.1 }}
          className="max-w-2xl mx-auto mt-12 mb-8"
        >
          <div className="pixel-card text-center">
            <PartyPopper className="w-10 h-10 text-accent mx-auto mb-4" />
            <h3 className="font-dnf text-lg text-foreground mb-2">
              올해의 이야기를 간직하세요
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              모든 질문과 답변을 PDF로 다운로드할 수 있어요
            </p>
            
            <PixelButton
              variant="accent"
              size="lg"
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full max-w-xs mx-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                {isDownloading ? 'PDF 생성 중...' : 'PDF 다운로드'}
              </span>
            </PixelButton>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            🎁 Unbox Us - 올해의 이야기를 담아서
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VictoryScreen;
