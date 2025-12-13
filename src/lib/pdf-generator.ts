import jsPDF from 'jspdf';
import { FullRoom, AnswerData } from './supabase-storage';

interface ThemeColors {
  background: string;
  cardBg: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  mutedText: string;
}

const getThemeColors = (theme: string): ThemeColors => {
  if (theme === 'horse') {
    return {
      background: '#1f1212', // 0 40% 8%
      cardBg: '#2a1a1a', // 0 35% 12%
      primary: '#e62e2e', // 0 80% 50%
      secondary: '#f2a122', // 35 90% 50%
      accent: '#ffc929', // 45 100% 60%
      text: '#fff9e6', // 45 100% 96%
      mutedText: '#d4c4a8', // 45 50% 70%
    };
  }
  // Christmas theme (default)
  return {
    background: '#0d2b1f', // 150 60% 8%
    cardBg: '#143327', // 150 50% 12%
    primary: '#e63333', // 0 75% 55%
    secondary: '#1c8f4f', // 140 60% 35%
    accent: '#ffc107', // 45 100% 55%
    text: '#fff9e6', // 45 100% 96%
    mutedText: '#d4c4a8', // 45 50% 70%
  };
};

// Draw pixel-style border
const drawPixelBorder = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  shadowColor: string = '#000000'
) => {
  // Main border
  doc.setDrawColor(color);
  doc.setLineWidth(2);
  doc.rect(x, y, width, height);
  
  // Pixel shadow effect (bottom-right)
  doc.setDrawColor(shadowColor);
  doc.setLineWidth(3);
  doc.line(x + 3, y + height + 1, x + width + 3, y + height + 1);
  doc.line(x + width + 1, y + 3, x + width + 1, y + height + 3);
};

// Draw pixel-style card
const drawPixelCard = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  bgColor: string,
  borderColor: string
) => {
  // Background
  doc.setFillColor(bgColor);
  doc.rect(x, y, width, height, 'F');
  
  // Pixel border effect
  drawPixelBorder(doc, x, y, width, height, borderColor);
};

export const generateResultsPDF = async (
  room: FullRoom,
  answersByParticipant: Record<string, AnswerData[]>
): Promise<void> => {
  const colors = getThemeColors(room.theme);
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  
  let currentY = margin;

  const addNewPageIfNeeded = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin) {
      doc.addPage();
      // Background for new page
      doc.setFillColor(colors.background);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      currentY = margin;
      return true;
    }
    return false;
  };

  // === PAGE 1: Cover ===
  // Background
  doc.setFillColor(colors.background);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative pixel border around page
  drawPixelBorder(doc, 8, 8, pageWidth - 16, pageHeight - 16, colors.accent);

  // Title card
  currentY = 50;
  drawPixelCard(doc, margin, currentY, contentWidth, 60, colors.cardBg, colors.accent);
  
  // Room name (title)
  doc.setTextColor(colors.accent);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(room.name, pageWidth / 2, currentY + 25, { align: 'center' });
  
  // Subtitle
  doc.setTextColor(colors.text);
  doc.setFontSize(14);
  doc.text('UNBOX US - 최종 결과', pageWidth / 2, currentY + 40, { align: 'center' });
  
  // Theme badge
  currentY += 80;
  const themeLabel = room.theme === 'horse' ? '🐴 2026 붉은 말' : '🎄 크리스마스';
  doc.setFillColor(colors.primary);
  doc.roundedRect(pageWidth / 2 - 30, currentY, 60, 12, 2, 2, 'F');
  doc.setTextColor(colors.text);
  doc.setFontSize(10);
  doc.text(themeLabel, pageWidth / 2, currentY + 8, { align: 'center' });

  // Stats
  currentY += 30;
  const participants = Object.keys(answersByParticipant);
  const statsText = `참여자 ${participants.length}명 · 질문 ${room.questions.length}개`;
  doc.setTextColor(colors.mutedText);
  doc.setFontSize(11);
  doc.text(statsText, pageWidth / 2, currentY, { align: 'center' });

  // Date
  currentY += 15;
  const dateText = `생성일: ${new Date(room.created_at).toLocaleDateString('ko-KR')}`;
  doc.text(dateText, pageWidth / 2, currentY, { align: 'center' });

  // Decorative elements based on theme
  currentY += 40;
  if (room.theme === 'horse') {
    // Sunrise-like decorative line
    doc.setDrawColor(colors.secondary);
    doc.setLineWidth(3);
    doc.line(margin + 20, currentY, pageWidth - margin - 20, currentY);
    doc.setDrawColor(colors.accent);
    doc.setLineWidth(2);
    doc.line(margin + 30, currentY + 5, pageWidth - margin - 30, currentY + 5);
  } else {
    // Christmas decorative elements
    doc.setDrawColor(colors.secondary);
    doc.setLineWidth(3);
    doc.line(margin + 20, currentY, pageWidth - margin - 20, currentY);
    doc.setDrawColor(colors.primary);
    doc.setLineWidth(2);
    doc.line(margin + 30, currentY + 5, pageWidth - margin - 30, currentY + 5);
  }

  // === PAGES 2+: Questions and Answers ===
  doc.addPage();
  doc.setFillColor(colors.background);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  currentY = margin;

  // Section header
  doc.setTextColor(colors.accent);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 질문별 답변 모음', margin, currentY + 5);
  currentY += 15;

  // Draw a separator line
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(1);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // Questions and answers
  for (let qIndex = 0; qIndex < room.questions.length; qIndex++) {
    const question = room.questions[qIndex];
    const questionAnswers = room.answers.filter(a => a.question_id === question.id);
    
    // Calculate needed height for this question block
    const questionHeight = 12;
    const answersHeight = questionAnswers.length * 20;
    const totalNeeded = questionHeight + answersHeight + 20;
    
    addNewPageIfNeeded(totalNeeded);

    // Question card
    drawPixelCard(doc, margin, currentY, contentWidth, questionHeight + 8, colors.cardBg, colors.secondary);
    
    doc.setTextColor(colors.accent);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const questionText = `Q${qIndex + 1}. ${question.text}`;
    const wrappedQuestion = doc.splitTextToSize(questionText, contentWidth - 10);
    doc.text(wrappedQuestion, margin + 5, currentY + 8);
    
    currentY += 8 + (wrappedQuestion.length * 5) + 10;

    // Answers
    if (questionAnswers.length === 0) {
      doc.setTextColor(colors.mutedText);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('답변이 없습니다', margin + 10, currentY);
      currentY += 15;
    } else {
      for (const answer of questionAnswers) {
        addNewPageIfNeeded(25);
        
        // Answer box
        doc.setFillColor(colors.cardBg);
        const answerLines = doc.splitTextToSize(answer.text, contentWidth - 20);
        const answerBoxHeight = Math.max(18, answerLines.length * 5 + 12);
        doc.rect(margin + 5, currentY, contentWidth - 10, answerBoxHeight, 'F');
        
        // Answer text
        doc.setTextColor(colors.text);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(answerLines, margin + 10, currentY + 6);
        
        // Author
        doc.setTextColor(colors.accent);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`— ${answer.author_nickname}`, margin + 10, currentY + answerBoxHeight - 3);
        
        currentY += answerBoxHeight + 5;
      }
    }
    
    currentY += 10;
  }

  // === FINAL PAGE: Participants Summary ===
  doc.addPage();
  doc.setFillColor(colors.background);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  currentY = margin;

  // Section header
  doc.setTextColor(colors.accent);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('👥 참여자별 답변 요약', margin, currentY + 5);
  currentY += 15;

  doc.setDrawColor(colors.accent);
  doc.setLineWidth(1);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // Participants list
  for (const [participant, answers] of Object.entries(answersByParticipant)) {
    addNewPageIfNeeded(40);

    // Participant card
    drawPixelCard(doc, margin, currentY, contentWidth, 12, colors.primary, colors.accent);
    
    doc.setTextColor(colors.text);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${participant} (${answers.length}개 답변)`, margin + 5, currentY + 8);
    currentY += 18;

    // Their answers
    for (const answer of answers) {
      addNewPageIfNeeded(20);
      
      const questionText = room.questions.find(q => q.id === answer.question_id)?.text || '';
      const qIndex = room.questions.findIndex(q => q.id === answer.question_id) + 1;
      
      doc.setTextColor(colors.mutedText);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Q${qIndex}. ${questionText}`, margin + 5, currentY);
      currentY += 5;
      
      doc.setTextColor(colors.text);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const answerLines = doc.splitTextToSize(answer.text, contentWidth - 15);
      doc.text(answerLines, margin + 10, currentY);
      currentY += answerLines.length * 4 + 8;
    }
    
    currentY += 5;
  }

  // Footer on last page
  currentY = pageHeight - 20;
  doc.setTextColor(colors.mutedText);
  doc.setFontSize(8);
  doc.text('Generated by Unbox Us 🎁', pageWidth / 2, currentY, { align: 'center' });

  // Save the PDF
  const fileName = `${room.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_결과.pdf`;
  doc.save(fileName);
};
