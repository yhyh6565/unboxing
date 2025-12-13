import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gift, Users, Sparkles, HelpCircle, FileText } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import SnowEffect from '@/components/SnowEffect';
import { generateResultsPDF } from '@/lib/pdf-generator';
import { toast } from 'sonner';

// Demo data for PDF preview - using inline types to avoid circular dependencies
const createDemoData = () => {
  const roomId = 'demo-room-id';
  const questions = [
    { id: 'q1', text: '올해 가장 기억에 남는 순간은?' },
    { id: 'q2', text: '2024년 나에게 주고 싶은 칭찬 한마디?' },
    { id: 'q3', text: '내년에 꼭 이루고 싶은 목표는?' },
  ];

  const answers = [
    { question_id: 'q1', author_nickname: '민수', text: '친구들과 함께한 제주도 여행! 바다에서 수영하고 맛있는 흑돼지도 먹고 정말 행복했어요 🌊' },
    { question_id: 'q1', author_nickname: '지영', text: '첫 해외여행으로 일본 오사카에 다녀왔어요. 도톤보리에서 먹은 타코야키 맛을 잊을 수가 없네요!' },
    { question_id: 'q1', author_nickname: '현우', text: '드디어 운전면허 땄다!! 6번만에 성공 ㅋㅋㅋ 포기하지 않길 잘했어' },
    { question_id: 'q2', author_nickname: '민수', text: '힘든 일도 많았지만 끝까지 버텨낸 나 자신이 대견해! 내년에도 화이팅!' },
    { question_id: 'q2', author_nickname: '지영', text: '새로운 도전을 두려워하지 않은 용감한 나에게 박수! 👏' },
    { question_id: 'q2', author_nickname: '현우', text: '매일 아침 운동하느라 고생했어. 덕분에 5kg 감량 성공!' },
    { question_id: 'q3', author_nickname: '민수', text: '영어 공부해서 해외여행 갈 때 불편함 없이 대화하고 싶어요!' },
    { question_id: 'q3', author_nickname: '지영', text: '저축해서 내 집 마련 첫 단추 끼우기! 🏠' },
    { question_id: 'q3', author_nickname: '현우', text: '마라톤 완주! 이번엔 진짜 해낼거야' },
  ];

  const room = {
    name: '2024 송년회 추억상자',
    theme: 'christmas',
    created_at: new Date().toISOString(),
    questions,
    answers,
  };

  const answersByParticipant = {
    '민수': answers.filter(a => a.author_nickname === '민수'),
    '지영': answers.filter(a => a.author_nickname === '지영'),
    '현우': answers.filter(a => a.author_nickname === '현우'),
  };

  return { room, answersByParticipant };
};

const Landing = () => {
  const navigate = useNavigate();
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);

  const handleDemoPDF = async () => {
    setIsGeneratingDemo(true);
    try {
      const { room, answersByParticipant } = createDemoData();
      await generateResultsPDF(room, answersByParticipant);
      toast.success('데모 PDF가 다운로드되었어요!');
    } catch (error) {
      console.error('Demo PDF error:', error);
      toast.error('PDF 생성에 실패했어요');
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SnowEffect />
      
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 left-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Gift className="w-12 h-12 text-primary" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-8"
        >
          <h1 className="font-dnf text-4xl sm:text-6xl md:text-7xl text-foreground pixel-text-shadow mb-4">
            Unboxing
          </h1>
          <motion.div
            className="w-48 h-2 bg-accent mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </motion.div>

        {/* Service Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-muted-foreground mb-6 max-w-md"
        >
          🎁 익명의 답변 속에서 친구를 찾아라! 연말 모임을 특별하게 만들어 줄 추억 제조기
        </motion.p>

        {/* Subtitle / Rules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-lg mx-auto mb-8 pixel-card"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-4 h-4 bg-accent flex-shrink-0 mt-1" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              지금 익명으로 답변하세요.
            </p>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-4 h-4 bg-secondary flex-shrink-0 mt-1" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              파티에서 다 같이 작성자를 공개해요!
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-primary flex-shrink-0 mt-1" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              솔직하고 재미있게! 🎁
            </p>
          </div>
        </motion.div>

        {/* How to Play & Demo Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/how-to-play')}
            className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            게임 플레이북 보기
          </button>
          
          <span className="text-muted-foreground">•</span>
          
          <button
            onClick={handleDemoPDF}
            disabled={isGeneratingDemo}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {isGeneratingDemo ? 'PDF 생성 중...' : 'PDF 결과물 미리보기'}
          </button>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.48 }}
          className="text-xs text-muted-foreground mb-6 text-center"
        >
          📄 파티가 끝나도 추억은 PDF로 영원히! 언박싱 결과를 저장해서 나중에 다시 꺼내보세요 ✨
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <PixelButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/create')}
          >
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              방 만들기
            </span>
          </PixelButton>
          
          <PixelButton
            variant="secondary"
            size="lg"
            onClick={() => navigate('/join')}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              방 참여하기
            </span>
          </PixelButton>
        </motion.div>

        {/* Floating pixel decorations */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-secondary"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
