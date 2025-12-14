import { supabase } from '@/integrations/supabase/client';

export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export interface RoomData {
  id: string;
  name: string;
  code: string;
  theme: string;
  participant_count: number;
  status: string;
  current_question_index: number;
  created_at: string;
}

export interface QuestionData {
  id: string;
  room_id: string;
  text: string;
  is_custom: boolean;
  order_index: number;
}

export interface AnswerData {
  id: string;
  room_id: string;
  question_id: string;
  text: string;
  author_nickname: string;
  is_revealed: boolean;
  created_at?: string;
}

export interface FullRoom extends RoomData {
  questions: QuestionData[];
  answers: AnswerData[];
}

// Create room with questions
export const createRoom = async (
  name: string,
  theme: string,
  participantCount: number,
  questions: { text: string; isCustom: boolean }[]
): Promise<FullRoom | null> => {
  const code = generateRoomCode();

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .insert({
      name,
      code,
      theme,
      participant_count: participantCount,
    })
    .select()
    .single();

  if (roomError || !room) {
    console.error('Error creating room:', roomError);
    return null;
  }

  const questionsToInsert = questions.map((q, index) => ({
    room_id: room.id,
    text: q.text,
    is_custom: q.isCustom,
    order_index: index,
  }));

  const { data: insertedQuestions, error: questionsError } = await supabase
    .from('questions')
    .insert(questionsToInsert)
    .select();

  if (questionsError) {
    console.error('Error creating questions:', questionsError);
  }

  return {
    ...room,
    questions: insertedQuestions || [],
    answers: [],
  };
};

// Get room by code
export const getRoomByCode = async (code: string): Promise<FullRoom | null> => {
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .maybeSingle();

  if (roomError || !room) return null;

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('room_id', room.id)
    .order('order_index');

  const { data: answers } = await supabase
    .from('answers')
    .select('*')
    .eq('room_id', room.id)
    .order('created_at', { ascending: true });

  return {
    ...room,
    questions: questions || [],
    answers: answers || [],
  };
};

// Get room by ID
export const getRoomById = async (id: string): Promise<FullRoom | null> => {
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (roomError || !room) return null;

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('room_id', room.id)
    .order('order_index');

  const { data: answers } = await supabase
    .from('answers')
    .select('*')
    .eq('room_id', room.id)
    .order('created_at', { ascending: true });

  return {
    ...room,
    questions: questions || [],
    answers: answers || [],
  };
};

// Submit answers
export const submitAnswers = async (
  roomId: string,
  authorNickname: string,
  answers: { questionId: string; text: string }[]
): Promise<boolean> => {
  const answersToInsert = answers.map((a) => ({
    room_id: roomId,
    question_id: a.questionId,
    text: a.text,
    author_nickname: authorNickname,
    is_revealed: false,
  }));

  const { error } = await supabase.from('answers').insert(answersToInsert);

  if (error) {
    console.error('Error submitting answers:', error);
    return false;
  }

  return true;
};

// Reveal answer
export const revealAnswer = async (answerId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('answers')
    .update({ is_revealed: true })
    .eq('id', answerId);

  return !error;
};

// Update room status
export const updateRoomStatus = async (
  roomId: string,
  status: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('rooms')
    .update({ status })
    .eq('id', roomId);

  return !error;
};

// Get unique participants count
export const getUniqueParticipantsCount = async (roomId: string): Promise<number> => {
  const { data } = await supabase
    .from('answers')
    .select('author_nickname')
    .eq('room_id', roomId);

  if (!data) return 0;

  const uniqueNames = new Set(data.map((a) => a.author_nickname));
  return uniqueNames.size;
};

// Subscribe to room answers (realtime)
export const subscribeToAnswers = (
  roomId: string,
  callback: (answers: AnswerData[]) => void
) => {
  const channel = supabase
    .channel(`room-answers-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'answers',
        filter: `room_id=eq.${roomId}`,
      },
      async () => {
        const { data } = await supabase
          .from('answers')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });
        callback(data || []);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Get all answers grouped by participant
export const getAnswersByParticipant = async (
  roomId: string
): Promise<Record<string, AnswerData[]>> => {
  const { data } = await supabase
    .from('answers')
    .select('*')
    .eq('room_id', roomId);

  if (!data) return {};

  return data.reduce((acc, answer) => {
    if (!acc[answer.author_nickname]) {
      acc[answer.author_nickname] = [];
    }
    acc[answer.author_nickname].push(answer);
    return acc;
  }, {} as Record<string, AnswerData[]>);
};
