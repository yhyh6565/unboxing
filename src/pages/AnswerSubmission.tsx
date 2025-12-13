import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Send, CheckCircle, Lock } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import PixelTextarea from '@/components/PixelTextarea';
import { getRoomByCode, getParticipant, addAnswerToRoom, saveParticipant, generateId } from '@/lib/storage';
import { Room, Answer } from '@/types/game';
import { toast } from 'sonner';

const AnswerSubmission = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    if (code) {
      const foundRoom = getRoomByCode(code);
      if (foundRoom) {
        setRoom(foundRoom);
        const participant = getParticipant();
        if (participant?.hasSubmitted && participant.roomCode === code) {
          setSubmitted(true);
        }
      } else {
        toast.error('Room not found');
        navigate('/join');
      }
    }
  }, [code, navigate]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const participant = getParticipant();
    if (!participant || !room) return;

    const unanswered = room.questions.filter(q => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      toast.error('Please answer all questions');
      return;
    }

    room.questions.forEach(question => {
      const answer: Answer = {
        id: generateId(),
        questionId: question.id,
        text: answers[question.id].trim(),
        authorNickname: participant.nickname,
        isRevealed: false,
      };
      addAnswerToRoom(room.code, answer);
    });

    saveParticipant({ ...participant, hasSubmitted: true });
    setSubmitted(true);
    toast.success('Answers submitted successfully!');
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

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-pixel text-muted-foreground">Loading...</div>
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
            <h2 className="font-pixel text-xl text-accent mb-4">All Done!</h2>
            <p className="font-pixel text-[10px] text-muted-foreground mb-2">
              Your answers are locked and ready to be unboxed.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="font-pixel text-[8px] text-muted-foreground">
                Identity hidden until the big reveal!
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
              Your name is hidden until we unbox it together
            </p>
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
                {Math.round(progress)}% complete
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
              placeholder="Type your answer here..."
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
              Previous
            </PixelButton>
            
            {currentQuestion < room.questions.length - 1 ? (
              <PixelButton
                variant="primary"
                onClick={nextQuestion}
                className="flex-1"
              >
                Next
              </PixelButton>
            ) : (
              <PixelButton
                variant="accent"
                onClick={handleSubmit}
                className="flex-1"
              >
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit
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
