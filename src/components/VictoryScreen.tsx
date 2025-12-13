import { motion } from 'framer-motion';
import { Download, PartyPopper, Trophy, Star } from 'lucide-react';
import PixelButton from './PixelButton';
import { useState } from 'react';

interface VictoryScreenProps {
  roomName: string;
  participantCount: number;
  questionCount: number;
  answerCount: number;
  theme: 'christmas' | 'horse';
  onDownloadPDF: () => Promise<void>;
  onBackToQuestions: () => void;
}

const VictoryScreen = ({
  roomName,
  participantCount,
  questionCount,
  answerCount,
  theme,
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

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    size: 8 + Math.random() * 16,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay with gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-background/95 backdrop-blur-sm"
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
          className="absolute pointer-events-none"
          style={{ fontSize: p.size }}
        >
          {theme === 'christmas' ? (
            ['🎄', '⭐', '🎁', '❄️', '🔔'][p.id % 5]
          ) : (
            ['🐴', '🧧', '🌅', '✨', '🎊'][p.id % 5]
          )}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
        className="relative z-10 pixel-card max-w-lg w-full text-center overflow-hidden"
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-secondary" />

        {/* Trophy icon with animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.4, damping: 10 }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <Trophy className="w-20 h-20 text-accent mx-auto" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Star className="w-8 h-8 text-secondary fill-secondary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Victory text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="font-dnf text-3xl sm:text-4xl text-accent mb-2 pixel-text-shadow">
            축하합니다!
          </h1>
          <p className="text-lg text-secondary font-dnf mb-4">
            모든 언박싱 완료!
          </p>
        </motion.div>

        {/* Room info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-muted/50 p-4 mb-6"
        >
          <h2 className="font-dnf text-xl text-foreground mb-3">{roomName}</h2>
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-dnf text-2xl text-accent">{participantCount}</div>
              <div className="text-muted-foreground">참여자</div>
            </div>
            <div className="text-center">
              <div className="font-dnf text-2xl text-secondary">{questionCount}</div>
              <div className="text-muted-foreground">질문</div>
            </div>
            <div className="text-center">
              <div className="font-dnf text-2xl text-primary">{answerCount}</div>
              <div className="text-muted-foreground">답변</div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <PixelButton
            variant="accent"
            size="lg"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              {isDownloading ? 'PDF 생성 중...' : 'PDF 다운로드'}
            </span>
          </PixelButton>

          <PixelButton
            variant="secondary"
            onClick={onBackToQuestions}
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              <PartyPopper className="w-4 h-4" />
              다시 둘러보기
            </span>
          </PixelButton>
        </motion.div>

        {/* Decorative bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          🎁 Unbox Us - 올해의 이야기를 담아서
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VictoryScreen;
