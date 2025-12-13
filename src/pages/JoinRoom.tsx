import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import PixelInput from '@/components/PixelInput';
import { getRoomByCode, saveParticipant } from '@/lib/storage';
import { toast } from 'sonner';

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');

  const handleJoin = () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    if (!nickname.trim()) {
      toast.error('Please enter your nickname');
      return;
    }

    const room = getRoomByCode(roomCode.toUpperCase());
    
    if (!room) {
      toast.error('Room not found. Check the code and try again.');
      return;
    }

    if (room.status !== 'collecting') {
      toast.error('This room is no longer accepting answers');
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
          className="flex items-center gap-2 font-pixel text-[10px] text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <div className="max-w-md mx-auto">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-pixel text-2xl text-foreground pixel-text-shadow mb-8 text-center"
          >
            Join Room
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="pixel-card space-y-6"
          >
            <div>
              <PixelInput
                label="Room Code"
                placeholder="ABCD12"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center tracking-widest text-lg"
              />
            </div>

            <div>
              <PixelInput
                label="Your Nickname"
                placeholder="Anonymous Hero"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <p className="font-pixel text-[8px] text-muted-foreground mt-2">
                This will be revealed when your answers are unboxed!
              </p>
            </div>

            <PixelButton
              variant="primary"
              size="lg"
              onClick={handleJoin}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Enter Room
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
            <p className="font-pixel text-[8px] text-muted-foreground">
              Ask the host for the room code 🎁
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
