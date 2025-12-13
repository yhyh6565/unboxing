import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Copy, Check } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import PixelInput from '@/components/PixelInput';
import ThemeSelector from '@/components/ThemeSelector';
import { Theme, Question, Room, DEFAULT_QUESTIONS } from '@/types/game';
import { saveRoom, generateRoomCode, generateId } from '@/lib/storage';
import { toast } from 'sonner';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [participantCount, setParticipantCount] = useState(4);
  const [theme, setTheme] = useState<Theme>('christmas');
  const [questions, setQuestions] = useState<Question[]>(
    DEFAULT_QUESTIONS.map(q => ({ ...q, id: generateId() }))
  );
  const [customQuestion, setCustomQuestion] = useState('');
  const [createdRoom, setCreatedRoom] = useState<Room | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCreate = () => {
    if (!roomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const room: Room = {
      id: generateId(),
      name: roomName.trim(),
      code: generateRoomCode(),
      theme,
      participantCount,
      questions,
      answers: [],
      status: 'collecting',
      currentQuestionIndex: 0,
      createdAt: Date.now(),
    };

    saveRoom(room);
    setCreatedRoom(room);
    toast.success('Room created successfully!');
  };

  const copyCode = () => {
    if (createdRoom) {
      navigator.clipboard.writeText(createdRoom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Code copied!');
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
            <h2 className="font-pixel text-xl text-accent mb-6">Room Created!</h2>
            
            <div className="mb-6">
              <p className="font-pixel text-[10px] text-muted-foreground mb-2">Room Code</p>
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

            <p className="font-pixel text-[10px] text-muted-foreground mb-6">
              Share this code with your friends!
            </p>

            <div className="flex flex-col gap-3">
              <PixelButton
                variant="primary"
                onClick={() => navigate(`/host/${createdRoom.id}`)}
              >
                Start Hosting
              </PixelButton>
              <PixelButton
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Back to Home
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
          Back
        </motion.button>

        <div className="max-w-2xl mx-auto">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-pixel text-2xl text-foreground pixel-text-shadow mb-8 text-center"
          >
            Create Room
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
                label="Room Name"
                placeholder="My Year-End Party"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            {/* Participant Count */}
            <div className="pixel-card">
              <label className="block text-[10px] font-pixel text-muted-foreground mb-2 uppercase">
                Expected Participants
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
                Theme
              </label>
              <ThemeSelector value={theme} onChange={setTheme} />
            </div>

            {/* Questions */}
            <div className="pixel-card">
              <label className="block text-[10px] font-pixel text-muted-foreground mb-4 uppercase">
                Questions ({questions.length})
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
                    {q.isCustom && (
                      <button
                        onClick={() => removeQuestion(q.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Add custom question */}
              <div className="flex gap-2">
                <PixelInput
                  placeholder="Add custom question..."
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
              className="w-full"
            >
              Create Room
            </PixelButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
