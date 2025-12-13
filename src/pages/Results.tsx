import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, MessageSquare, Download } from 'lucide-react';
import SnowEffect from '@/components/SnowEffect';
import { getRoomById, getAnswersByParticipant, FullRoom, AnswerData } from '@/lib/supabase-storage';
import { generateResultsPDF } from '@/lib/pdf-generator';
import { toast } from 'sonner';
const Results = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<FullRoom | null>(null);
  const [answersByParticipant, setAnswersByParticipant] = useState<Record<string, AnswerData[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!room) return;
    
    setIsGeneratingPDF(true);
    try {
      await generateResultsPDF(room, answersByParticipant);
      toast.success('PDF 다운로드 완료!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('PDF 생성에 실패했어요');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const foundRoom = await getRoomById(id);
        if (foundRoom) {
          setRoom(foundRoom);
          const grouped = await getAnswersByParticipant(id);
          setAnswersByParticipant(grouped);
        } else {
          toast.error('방을 찾을 수 없어요');
          navigate('/');
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">방을 찾을 수 없어요</div>
      </div>
    );
  }

  const participants = Object.keys(answersByParticipant);
  const getQuestionText = (questionId: string) => {
    return room.questions.find(q => q.id === questionId)?.text || '질문을 찾을 수 없어요';
  };

  return (
    <div className={`min-h-screen ${room.theme === 'horse' ? 'theme-horse' : ''}`}>
      {room.theme === 'christmas' && <SnowEffect />}
      
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />

      <div className="relative z-20 min-h-screen p-4 sm:p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(`/host/${room.id}`)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            호스트 화면으로 돌아가기
          </button>
          
          <h1 className="font-dnf text-2xl sm:text-3xl text-foreground pixel-text-shadow">
            {room.name} - 최종 결과
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
            <p className="text-sm text-muted-foreground">
              참여자별 답변 모아보기
            </p>
            {participants.length > 0 && (
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="pixel-btn flex items-center gap-2 text-xs py-2 px-4 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? '생성 중...' : 'PDF 다운로드'}
              </button>
            )}
          </div>
        </motion.div>

        {participants.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="pixel-card text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                아직 제출된 답변이 없어요
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Participant List */}
            <div className="lg:col-span-1">
              <div className="pixel-card">
                <h2 className="text-lg text-accent mb-4 font-bold">
                  참여자 목록 ({participants.length}명)
                </h2>
                <div className="space-y-2">
                  {participants.map((name, index) => (
                    <motion.button
                      key={name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedParticipant(name === selectedParticipant ? null : name)}
                      className={`w-full flex items-center gap-3 p-3 transition-colors ${
                        selectedParticipant === name
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">{name}</span>
                      <span className="text-xs ml-auto">
                        {answersByParticipant[name].length}개 답변
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Answers Display */}
            <div className="lg:col-span-2">
              {selectedParticipant ? (
                <motion.div
                  key={selectedParticipant}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pixel-card"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-accent" />
                    <h2 className="font-dnf text-xl text-foreground">
                      {selectedParticipant}의 답변
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {answersByParticipant[selectedParticipant].map((answer, index) => (
                      <motion.div
                        key={answer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-muted p-4"
                      >
                        <p className="text-sm text-accent mb-2">
                          Q{index + 1}. {getQuestionText(answer.question_id)}
                        </p>
                        <p className="text-base text-foreground leading-relaxed">
                          {answer.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="pixel-card flex items-center justify-center min-h-[300px]">
                  <p className="text-sm text-muted-foreground">
                    왼쪽에서 참여자를 선택하세요
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Answers by Question */}
        {participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <h2 className="font-dnf text-xl text-accent mb-6">질문별 전체 답변</h2>
            
            <div className="space-y-8">
              {room.questions.map((question, qIndex) => {
                const questionAnswers = room.answers.filter(a => a.question_id === question.id);
                
                return (
                  <div key={question.id} className="pixel-card">
                    <h3 className="text-base text-foreground mb-4 font-bold">
                      Q{qIndex + 1}. {question.text}
                    </h3>
                    
                    {questionAnswers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        답변이 없어요
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {questionAnswers.map((answer, aIndex) => (
                          <motion.div
                            key={answer.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: aIndex * 0.05 }}
                            className="bg-muted p-3"
                          >
                            <p className="text-sm text-foreground mb-2">
                              {answer.text}
                            </p>
                            <p className="text-xs text-accent">
                              - {answer.author_nickname}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
