import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Copy, Check, Play, RotateCcw } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import GiftBox from '@/components/GiftBox';
import SnowEffect from '@/components/SnowEffect';
import { getRoomById, saveRoom, revealAnswer } from '@/lib/storage';
import { Room, Answer } from '@/types/game';
import { toast } from 'sonner';

const HostView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const foundRoom = getRoomById(id);
      if (foundRoom) {
        setRoom(foundRoom);
        setCurrentQuestionIndex(foundRoom.currentQuestionIndex);
      } else {
        toast.error('Room not found');
        navigate('/');
      }
    }
  }, [id, navigate]);

  const refreshRoom = () => {
    if (id) {
      const updated = getRoomById(id);
      if (updated) setRoom(updated);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshRoom, 2000);
    return () => clearInterval(interval);
  }, [id]);

  const copyCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Code copied!');
    }
  };

  const startUnboxing = () => {
    if (room) {
      room.status = 'unboxing';
      saveRoom(room);
      setRoom({ ...room });
      toast.success("Let's unbox!");
    }
  };

  const handleReveal = (answerId: string) => {
    if (room) {
      revealAnswer(room.id, answerId);
      refreshRoom();
    }
  };

  const nextQuestion = () => {
    if (room && currentQuestionIndex < room.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-pixel text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const currentQuestion = room.questions[currentQuestionIndex];
  const currentAnswers = room.answers.filter(a => a.questionId === currentQuestion?.id);
  const uniqueParticipants = [...new Set(room.answers.map(a => a.authorNickname))].length;

  return (
    <div className={`min-h-screen ${room.theme === 'horse' ? 'theme-horse' : ''}`}>
      {room.theme === 'christmas' && <SnowEffect />}
      
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />

      <div className="relative z-20 min-h-screen p-4 sm:p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-pixel text-xl sm:text-2xl text-foreground pixel-text-shadow">
              {room.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-pixel text-[10px] text-muted-foreground">Code:</span>
              <span className="font-pixel text-lg text-accent tracking-widest">{room.code}</span>
              <button
                onClick={copyCode}
                className="p-1 bg-muted hover:bg-muted/80"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-secondary" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="pixel-card px-4 py-2">
              <span className="font-pixel text-[10px] text-muted-foreground">Participants: </span>
              <span className="font-pixel text-lg text-accent">{uniqueParticipants}</span>
            </div>
            
            <button
              onClick={refreshRoom}
              className="p-2 bg-muted hover:bg-muted/80"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Collecting Phase */}
        {room.status === 'collecting' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="pixel-card text-center max-w-lg">
              <h2 className="font-pixel text-lg text-accent mb-4">Waiting for Answers</h2>
              <p className="font-pixel text-[10px] text-muted-foreground mb-6">
                Share the room code with participants. Once everyone has submitted, start the unboxing!
              </p>
              
              <div className="mb-6">
                <div className="font-pixel text-[10px] text-muted-foreground mb-2">
                  Answers received:
                </div>
                <div className="font-pixel text-3xl text-secondary">
                  {room.answers.length}
                </div>
                <div className="font-pixel text-[8px] text-muted-foreground">
                  ({room.questions.length} questions × {uniqueParticipants} participants)
                </div>
              </div>

              <PixelButton
                variant="primary"
                size="lg"
                onClick={startUnboxing}
                disabled={room.answers.length === 0}
              >
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Unboxing
                </span>
              </PixelButton>
            </div>
          </motion.div>
        )}

        {/* Unboxing Phase */}
        {room.status === 'unboxing' && currentQuestion && (
          <div>
            {/* Question Navigation */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="p-3 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.div
                key={currentQuestion.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pixel-card max-w-2xl flex-1 mx-4 text-center"
              >
                <span className="font-pixel text-xs text-accent mb-2 block">
                  Question {currentQuestionIndex + 1} / {room.questions.length}
                </span>
                <h2 className="font-pixel text-sm sm:text-lg text-foreground leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </motion.div>

              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === room.questions.length - 1}
                className="p-3 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Gift Boxes / Answers */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
              <AnimatePresence mode="wait">
                {currentAnswers.map((answer, index) => (
                  <GiftBox
                    key={answer.id}
                    theme={room.theme}
                    isRevealed={answer.isRevealed}
                    answerText={answer.text}
                    authorName={answer.authorNickname}
                    onClick={() => handleReveal(answer.id)}
                    index={index}
                  />
                ))}
              </AnimatePresence>

              {currentAnswers.length === 0 && (
                <div className="font-pixel text-[10px] text-muted-foreground">
                  No answers for this question yet
                </div>
              )}
            </div>

            {/* Question dots */}
            <div className="flex justify-center gap-2 mt-8">
              {room.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-4 h-4 transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-accent animate-pulse-glow'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostView;
