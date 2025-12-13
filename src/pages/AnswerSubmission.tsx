import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Send, CheckCircle, Lock, Edit3 } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import PixelTextarea from '@/components/PixelTextarea';
import PixelInput from '@/components/PixelInput';
import { getRoomByCode, submitAnswers, FullRoom } from '@/lib/supabase-storage';
import { getParticipant, saveParticipant } from '@/lib/storage';
import { toast } from 'sonner';

const AnswerSubmission = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const [room, setRoom] = useState<FullRoom | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadRoom = async () => {
      if (code) {
        const foundRoom = await getRoomByCode(code);
        if (foundRoom) {
          setRoom(foundRoom);
          const participant = getParticipant();
          if (participant?.hasSubmitted && participant.roomCode === code) {
            setSubmitted(true);
          }
          if (participant?.nickname && participant.roomCode === code) {
            setNickname(participant.nickname);
          }
        } else {
          toast.error('방을 찾을 수 없어요');
          navigate('/join');
        }
      }
      setIsLoading(false);
    };

    loadRoom();
  }, [code, navigate]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      toast.error('닉네임을 입력해주세요');
      return;
    }

    if (!room) return;

    const unanswered = room.questions.filter(q => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      toast.error('모든 질문에 답변해주세요');
      return;
    }

    setIsSubmitting(true);

    const answersArray = room.questions.map(question => ({
      questionId: question.id,
      text: answers[question.id].trim(),
    }));

    const success = await submitAnswers(room.id, nickname.trim(), answersArray);

    setIsSubmitting(false);

    if (success) {
      saveParticipant({ nickname: nickname.trim(), roomCode: room.code, hasSubmitted: true });
      setSubmitted(true);
      toast.success('답변이 제출되었어요!');
    } else {
      toast.error('제출에 실패했어요. 다시 시도해주세요.');
    }
  };

  const nextQuestion = () => {
    if (room && currentQuestion < room.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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

  if (submitted) {
    return (
      <div className={`min-h-screen ${room.theme === 'horse' ? 'theme-horse' : ''}`}>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="pixel-card text-center max-w-md"
          >
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
            </motion.div>
            <h2 className="font-pixel text-xl text-accent mb-4">제출 완료!</h2>
            <p className="font-pixel text-[10px] text-muted-foreground mb-2">
              답변이 잠금 처리되었어요. 파티에서 함께 공개해요!
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="font-pixel text-[8px] text-muted-foreground">
                공개될 때까지 비밀이에요!
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = room.questions[currentQuestion];
  const progress = ((Object.keys(answers).filter(k => answers[k]?.trim()).length) / room.questions.length) * 100;

  return (
    <div className={`min-h-screen ${room.theme === 'horse' ? 'theme-horse' : ''}`}>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-6"
          >
            <h1 className="font-pixel text-lg text-foreground mb-2">{room.name}</h1>
            <p className="font-pixel text-[8px] text-muted-foreground">
              닉네임은 공개 시 함께 보여져요
            </p>
          </motion.div>

          {/* Nickname input */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <div className="pixel-card">
              <div className="flex items-center gap-2 mb-2">
                <Edit3 className="w-4 h-4 text-accent" />
                <label className="font-pixel text-[10px] text-muted-foreground uppercase">
                  닉네임
                </label>
              </div>
              <PixelInput
                placeholder="나의 닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-4 bg-muted">
              <motion.div
                className="h-full bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-pixel text-[8px] text-muted-foreground">
                {currentQuestion + 1} / {room.questions.length}
              </span>
              <span className="font-pixel text-[8px] text-accent">
                {Math.round(progress)}% 완료
              </span>
            </div>
          </div>

          {/* Question card */}
          <motion.div
            key={question.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="pixel-card mb-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="font-pixel text-lg text-accent flex-shrink-0">
                Q{currentQuestion + 1}
              </span>
              <p className="font-pixel text-[10px] text-foreground leading-relaxed">
                {question.text}
              </p>
            </div>
            
            <PixelTextarea
              placeholder="여기에 답변을 입력하세요..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              rows={4}
            />
          </motion.div>

          {/* Navigation */}
          <div className="flex gap-4">
            <PixelButton
              variant="secondary"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex-1"
            >
              이전
            </PixelButton>
            
            {currentQuestion < room.questions.length - 1 ? (
              <PixelButton
                variant="primary"
                onClick={nextQuestion}
                className="flex-1"
              >
                다음
              </PixelButton>
            ) : (
              <PixelButton
                variant="accent"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {isSubmitting ? '제출 중...' : '제출하기'}
                </span>
              </PixelButton>
            )}
          </div>

          {/* Question dots */}
          <div className="flex justify-center gap-2 mt-6">
            {room.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-3 h-3 transition-colors ${
                  index === currentQuestion
                    ? 'bg-accent'
                    : answers[q.id]?.trim()
                    ? 'bg-secondary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerSubmission;
