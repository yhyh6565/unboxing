import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Users, Gift, Send, Sparkles, PartyPopper } from 'lucide-react';
import PixelButton from '@/components/PixelButton';
import SnowEffect from '@/components/SnowEffect';

const HowToPlay = () => {
  const navigate = useNavigate();

  const hostSteps = [
    {
      icon: Gift,
      title: '1. 방 만들기',
      description: '방 이름을 짓고, 테마를 고르고, 질문을 커스텀하세요.',
    },
    {
      icon: Send,
      title: '2. 링크 공유하기',
      description: '생성된 설문 링크를 친구들에게 공유하세요.',
    },
    {
      icon: Users,
      title: '3. 답변 기다리기',
      description: '친구들이 익명으로 답변을 제출할 때까지 기다려요.',
    },
    {
      icon: PartyPopper,
      title: '4. 언박싱 파티!',
      description: '모임에서 다 같이 선물 상자를 열며 답변을 공개해요!',
    },
  ];

  const participantSteps = [
    {
      icon: Gift,
      title: '1. 링크 클릭',
      description: '주최자가 공유한 설문 링크를 클릭하세요.',
    },
    {
      icon: Users,
      title: '2. 닉네임 입력',
      description: '친구들이 알아볼 수 있는 닉네임을 적어요.',
    },
    {
      icon: Send,
      title: '3. 솔직하게 답변',
      description: '각 질문에 재미있고 솔직하게 답변하세요!',
    },
    {
      icon: Sparkles,
      title: '4. 파티에서 공개',
      description: '모임에서 함께 누가 뭐라고 적었는지 맞춰봐요!',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SnowEffect />
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />

      <div className="relative z-20 min-h-screen px-4 py-8">
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

        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="font-dnf text-3xl sm:text-4xl text-foreground pixel-text-shadow mb-4">
              게임 플레이북 📖
            </h1>
            <p className="text-muted-foreground">
              Unboxing을 200% 즐기는 방법
            </p>
          </motion.div>

          {/* Two columns: Host & Participant */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Host Section */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pixel-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-accent" />
                <h2 className="font-dnf text-xl text-accent">주최자라면?</h2>
              </div>

              <div className="space-y-6">
                {hostSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-primary flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-muted">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>팁:</strong> 파티 전에 미리 방을 만들고, 모임원들에게 답변 제출 마감일을 알려주세요!
                </p>
              </div>
            </motion.div>

            {/* Participant Section */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pixel-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-secondary" />
                <h2 className="font-dnf text-xl text-secondary">참여자라면?</h2>
              </div>

              <div className="space-y-6">
                {participantSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-secondary flex items-center justify-center">
                        <Icon className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-muted">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>팁:</strong> 닉네임은 공개되니, 친구들이 알아볼 수 있는 이름으로 해주세요!
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-6">
              이제 준비됐나요? 연말 파티를 시작해보세요! 🎉
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PixelButton variant="primary" onClick={() => navigate('/create')}>
                방 만들기
              </PixelButton>
              <PixelButton variant="secondary" onClick={() => navigate('/join')}>
                방 참여하기
              </PixelButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
