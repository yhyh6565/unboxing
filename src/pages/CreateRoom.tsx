import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Copy, Check, Share2, Minus } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import PixelInput from '@/components/PixelInput';
import ThemeSelector from '@/components/ThemeSelector';
import { Theme, Question, DEFAULT_QUESTIONS } from '@/types/game';
import { createRoom, FullRoom } from '@/lib/supabase-storage';
import { toast } from 'sonner';

const generateId = () => Math.random().toString(36).substring(2, 15);

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [participantCount, setParticipantCount] = useState(4);
  const [theme, setTheme] = useState<Theme>('christmas');
  const [questions, setQuestions] = useState<Question[]>(
    DEFAULT_QUESTIONS.map(q => ({ ...q, id: generateId() }))
  );
  const [customQuestion, setCustomQuestion] = useState('');
  const [createdRoom, setCreatedRoom] = useState<FullRoom | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const addCustomQuestion = () => {
    if (customQuestion.trim()) {
      setQuestions([
        ...questions,
        { id: generateId(), text: customQuestion.trim(), isCustom: true }
      ]);
      setCustomQuestion('');
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleCreate = async () => {
    if (!roomName.trim()) {
      toast.error('방 이름을 입력해주세요');
      return;
    }

    if (questions.length === 0) {
      toast.error('최소 하나의 질문이 필요해요');
      return;
    }

    setIsCreating(true);
    
    const room = await createRoom(
      roomName.trim(),
      theme,
      participantCount,
      questions.map(q => ({ text: q.text, isCustom: q.isCustom }))
    );

    setIsCreating(false);

    if (room) {
      setCreatedRoom(room);
      toast.success('방이 생성되었어요!');
    } else {
      toast.error('방 생성에 실패했어요. 다시 시도해주세요.');
    }
  };

  const copyCode = () => {
    if (createdRoom) {
      navigator.clipboard.writeText(createdRoom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('코드가 복사되었어요!');
    }
  };

  const getSurveyLink = () => {
    return `${window.location.origin}/answer/${createdRoom?.code}`;
  };

  const copyLink = () => {
    if (createdRoom) {
      navigator.clipboard.writeText(getSurveyLink());
      toast.success('설문 링크가 복사되었어요!');
    }
  };

  const shareLink = async () => {
    if (createdRoom && navigator.share) {
      try {
        await navigator.share({
          title: `${createdRoom.name} - 언박스 어스`,
          text: '올해의 이야기를 함께 나눠요! 아래 링크에서 답변해주세요.',
          url: getSurveyLink(),
        });
      } catch (err) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  if (createdRoom) {
    return (
      <div className={`min-h-screen ${theme === 'horse' ? 'theme-horse' : ''}`}>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="pixel-card max-w-md w-full text-center"
          >
            <h2 className="font-pixel text-xl text-accent mb-6">방이 생성되었어요!</h2>
            
            <div className="mb-6">
              <p className="font-pixel text-[10px] text-muted-foreground mb-2">방 코드</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-pixel text-3xl text-foreground tracking-widest">
                  {createdRoom.code}
                </span>
                <button
                  onClick={copyCode}
                  className="p-2 bg-muted hover:bg-muted/80 transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-secondary" />
                  ) : (
                    <Copy className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* 설문 링크 공유 */}
            <div className="mb-6 p-4 bg-muted">
              <p className="font-pixel text-[10px] text-muted-foreground mb-3">
                아래 링크를 모임원들에게 공유하세요!
              </p>
              <div className="font-pixel text-[8px] text-accent break-all mb-3 p-2 bg-background">
                {getSurveyLink()}
              </div>
              <PixelButton
                variant="accent"
                onClick={shareLink}
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  설문 링크 공유하기
                </span>
              </PixelButton>
            </div>

            <p className="font-pixel text-[10px] text-muted-foreground mb-6">
              모임원들이 링크를 통해 바로 답변할 수 있어요!
            </p>

            <div className="flex flex-col gap-3">
              <PixelButton
                variant="primary"
                onClick={() => navigate(`/host/${createdRoom.id}`)}
              >
                호스팅 시작하기
              </PixelButton>
              <PixelButton
                variant="secondary"
                onClick={() => navigate('/')}
              >
                홈으로 돌아가기
              </PixelButton>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'horse' ? 'theme-horse' : ''}`}>
      <div className="min-h-screen px-4 py-8">
        {/* Back button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-pixel text-[10px] text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로
        </motion.button>

        <div className="max-w-2xl mx-auto">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-pixel text-2xl text-foreground pixel-text-shadow mb-8 text-center"
          >
            방 만들기
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Room Name */}
            <div className="pixel-card">
              <PixelInput
                label="방 이름"
                placeholder="우리의 연말 파티"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            {/* Participant Count */}
            <div className="pixel-card">
              <label className="block text-[10px] font-pixel text-muted-foreground mb-2 uppercase">
                예상 참여자 수
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setParticipantCount(Math.max(2, participantCount - 1))}
                  className="w-10 h-10 bg-muted hover:bg-muted/80 font-pixel text-xl"
                >
                  -
                </button>
                <span className="font-pixel text-2xl text-foreground w-16 text-center">
                  {participantCount}
                </span>
                <button
                  onClick={() => setParticipantCount(Math.min(20, participantCount + 1))}
                  className="w-10 h-10 bg-muted hover:bg-muted/80 font-pixel text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="pixel-card">
              <label className="block text-[10px] font-pixel text-muted-foreground mb-4 uppercase">
                테마
              </label>
              <ThemeSelector value={theme} onChange={setTheme} />
            </div>

            {/* Questions */}
            <div className="pixel-card">
              <label className="block text-[10px] font-pixel text-muted-foreground mb-4 uppercase">
                질문 목록 ({questions.length}개)
              </label>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {questions.map((q, index) => (
                  <motion.div
                    key={q.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-start gap-3 bg-muted p-3"
                  >
                    <span className="font-pixel text-[10px] text-accent flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-pixel text-[10px] text-foreground flex-1">
                      {q.text}
                    </span>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className={q.isCustom ? "text-destructive hover:text-destructive/80" : "text-muted-foreground hover:text-foreground"}
                    >
                      {q.isCustom ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Add custom question */}
              <div className="flex gap-2">
                <PixelInput
                  placeholder="나만의 질문 추가..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomQuestion()}
                />
                <PixelButton
                  variant="accent"
                  onClick={addCustomQuestion}
                  className="flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </PixelButton>
              </div>
            </div>

            {/* Create Button */}
            <PixelButton
              variant="primary"
              size="lg"
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? '생성 중...' : '방 만들기'}
            </PixelButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
