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
  { text: "What was your most frequent thought in 2025?", isCustom: false },
  { text: "One new thing you learned about yourself this year?", isCustom: false },
  { text: "Where did you spend the most money this year?", isCustom: false },
  { text: "Where did you spend the most time this year?", isCustom: false },
  { text: "What/Who did you pour the most emotion into?", isCustom: false },
  { text: "A trivial skill you acquired this year?", isCustom: false },
];
