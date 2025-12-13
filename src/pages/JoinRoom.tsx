import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import PixelInput from '@/components/PixelInput';
import { getRoomByCode } from '@/lib/supabase-storage';
import { saveParticipant } from '@/lib/storage';
import { toast } from 'sonner';

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      toast.error('방 코드를 입력해주세요');
      return;
    }

    if (!nickname.trim()) {
      toast.error('닉네임을 입력해주세요');
      return;
    }

    setIsJoining(true);
    const room = await getRoomByCode(roomCode.toUpperCase());
    setIsJoining(false);
    
    if (!room) {
      toast.error('방을 찾을 수 없어요. 코드를 확인해주세요.');
      return;
    }

    if (room.status !== 'collecting') {
      toast.error('이 방은 더 이상 답변을 받지 않아요');
      return;
    }

    saveParticipant({
      nickname: nickname.trim(),
      roomCode: room.code,
      hasSubmitted: false,
    });

    navigate(`/answer/${room.code}`);
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-screen px-4 py-8">
        {/* Back button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로
        </motion.button>

        <div className="max-w-md mx-auto">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-dnf text-3xl text-foreground pixel-text-shadow mb-8 text-center"
          >
            방 참여하기
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="pixel-card space-y-6"
          >
            <div>
              <PixelInput
                label="방 코드"
                placeholder="ABCD12"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center tracking-widest text-lg"
              />
            </div>

            <div>
              <PixelInput
                label="닉네임"
                placeholder="익명의 영웅"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                이 이름은 답변 공개 시 함께 보여져요!
              </p>
            </div>

            <PixelButton
              variant="primary"
              size="lg"
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                {isJoining ? '참여 중...' : '입장하기'}
              </span>
            </PixelButton>
          </motion.div>

          {/* Decorative hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              방 코드는 주최자에게 물어보세요 🎁
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
