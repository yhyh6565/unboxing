import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Copy, Check, Play, RotateCcw, Share2, BarChart3 } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import GiftBox from '@/components/GiftBox';
import SnowEffect from '@/components/SnowEffect';
import { getRoomById, updateRoomStatus, revealAnswer, subscribeToAnswers, FullRoom, AnswerData } from '@/lib/supabase-storage';
import { toast } from 'sonner';

const HostView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<FullRoom | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRoom = async () => {
      if (id) {
        const foundRoom = await getRoomById(id);
        if (foundRoom) {
          setRoom(foundRoom);
          setCurrentQuestionIndex(foundRoom.current_question_index);
        } else {
          toast.error('방을 찾을 수 없어요');
          navigate('/');
        }
      }
      setIsLoading(false);
    };

    loadRoom();
  }, [id, navigate]);

  // Subscribe to realtime answer updates
  useEffect(() => {
    if (!room?.id) return;

    const unsubscribe = subscribeToAnswers(room.id, (newAnswers: AnswerData[]) => {
      setRoom(prev => prev ? { ...prev, answers: newAnswers } : null);
    });

    return unsubscribe;
  }, [room?.id]);

  const refreshRoom = async () => {
    if (id) {
      const updated = await getRoomById(id);
      if (updated) setRoom(updated);
    }
  };

  const copyCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('코드가 복사되었어요!');
    }
  };

  const getSurveyLink = () => {
    return `${window.location.origin}/answer/${room?.code}`;
  };

  const shareLink = async () => {
    if (room && navigator.share) {
      try {
        await navigator.share({
          title: `${room.name} - 언박스 어스`,
          text: '올해의 이야기를 함께 나눠요! 아래 링크에서 답변해주세요.',
          url: getSurveyLink(),
        });
      } catch (err) {
        navigator.clipboard.writeText(getSurveyLink());
        toast.success('설문 링크가 복사되었어요!');
      }
    } else {
      navigator.clipboard.writeText(getSurveyLink());
      toast.success('설문 링크가 복사되었어요!');
    }
  };

  const startUnboxing = async () => {
    if (room) {
      const success = await updateRoomStatus(room.id, 'unboxing');
      if (success) {
        setRoom({ ...room, status: 'unboxing' });
        toast.success('언박싱을 시작해요!');
      }
    }
  };

  const handleReveal = async (answerId: string) => {
    const success = await revealAnswer(answerId);
    if (success) {
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          answers: prev.answers.map(a => 
            a.id === answerId ? { ...a, is_revealed: true } : a
          ),
        };
      });
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-pixel text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-pixel text-muted-foreground">방을 찾을 수 없어요</div>
      </div>
    );
  }

  const currentQuestion = room.questions[currentQuestionIndex];
  const currentAnswers = room.answers.filter(a => a.question_id === currentQuestion?.id);
  const uniqueParticipants = [...new Set(room.answers.map(a => a.author_nickname))].length;

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
              <span className="font-pixel text-[10px] text-muted-foreground">코드:</span>
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
              <button
                onClick={shareLink}
                className="p-1 bg-muted hover:bg-muted/80"
              >
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="pixel-card px-4 py-2">
              <span className="font-pixel text-[10px] text-muted-foreground">참여자: </span>
              <span className="font-pixel text-lg text-accent">{uniqueParticipants}</span>
            </div>
            
            <button
              onClick={() => navigate(`/results/${room.id}`)}
              className="p-2 bg-muted hover:bg-muted/80"
              title="결과 보기"
            >
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </button>
            
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
              <h2 className="font-pixel text-lg text-accent mb-4">답변 수집 중</h2>
              <p className="font-pixel text-[10px] text-muted-foreground mb-6">
                참여자들에게 설문 링크를 공유하세요. 모두 제출하면 언박싱을 시작하세요!
              </p>
              
              <div className="mb-4 p-3 bg-muted">
                <p className="font-pixel text-[8px] text-muted-foreground mb-2">설문 링크</p>
                <p className="font-pixel text-[10px] text-accent break-all">{getSurveyLink()}</p>
              </div>
              
              <PixelButton
                variant="accent"
                onClick={shareLink}
                className="w-full mb-6"
              >
                <span className="flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  설문 링크 공유하기
                </span>
              </PixelButton>
              
              <div className="mb-6">
                <div className="font-pixel text-[10px] text-muted-foreground mb-2">
                  받은 답변:
                </div>
                <div className="font-pixel text-3xl text-secondary">
                  {room.answers.length}
                </div>
                <div className="font-pixel text-[8px] text-muted-foreground">
                  ({room.questions.length}개 질문 × {uniqueParticipants}명 참여)
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
                  언박싱 시작하기
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
                  질문 {currentQuestionIndex + 1} / {room.questions.length}
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
                    theme={room.theme as 'christmas' | 'horse'}
                    isRevealed={answer.is_revealed}
                    answerText={answer.text}
                    authorName={answer.author_nickname}
                    onClick={() => handleReveal(answer.id)}
                    index={index}
                  />
                ))}
              </AnimatePresence>

              {currentAnswers.length === 0 && (
                <div className="font-pixel text-[10px] text-muted-foreground">
                  이 질문에 대한 답변이 아직 없어요
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
