export type Theme = 'christmas' | 'horse';

export interface Question {
  id: string;
  text: string;
  isCustom: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  text: string;
  authorNickname: string;
  isRevealed: boolean;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  theme: Theme;
  participantCount: number;
  questions: Question[];
  answers: Answer[];
  status: 'collecting' | 'unboxing' | 'completed';
  currentQuestionIndex: number;
  createdAt: number;
}

export interface Participant {
  nickname: string;
  roomCode: string;
  hasSubmitted: boolean;
}

export const DEFAULT_QUESTIONS: Omit<Question, 'id'>[] = [
  { text: "2025년에 가장 자주 했던 생각은?", isCustom: false },
  { text: "올해 나 자신에 대해 새롭게 알게 된 것은?", isCustom: false },
  { text: "올해 가장 돈을 많이 쓴 곳은?", isCustom: false },
  { text: "올해 가장 시간을 많이 쓴 곳은?", isCustom: false },
  { text: "올해 가장 감정을 쏟은 대상은?", isCustom: false },
  { text: "올해 습득한 사소한 기술 하나?", isCustom: false },
];
