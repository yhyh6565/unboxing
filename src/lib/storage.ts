import { Room, Answer, Participant } from '@/types/game';

const ROOMS_KEY = 'unboxing_rooms';
const PARTICIPANT_KEY = 'unboxing_participant';

export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const saveRoom = (room: Room): void => {
  const rooms = getAllRooms();
  const existingIndex = rooms.findIndex(r => r.id === room.id);
  
  if (existingIndex >= 0) {
    rooms[existingIndex] = room;
  } else {
    rooms.push(room);
  }
  
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

export const getAllRooms = (): Room[] => {
  const data = localStorage.getItem(ROOMS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getRoomByCode = (code: string): Room | null => {
  const rooms = getAllRooms();
  return rooms.find(r => r.code === code) || null;
};

export const getRoomById = (id: string): Room | null => {
  const rooms = getAllRooms();
  return rooms.find(r => r.id === id) || null;
};

export const addAnswerToRoom = (roomCode: string, answer: Answer): void => {
  const room = getRoomByCode(roomCode);
  if (room) {
    room.answers.push(answer);
    saveRoom(room);
  }
};

export const revealAnswer = (roomId: string, answerId: string): void => {
  const room = getRoomById(roomId);
  if (room) {
    const answer = room.answers.find(a => a.id === answerId);
    if (answer) {
      answer.isRevealed = true;
      saveRoom(room);
    }
  }
};

export const updateRoomStatus = (roomId: string, status: Room['status']): void => {
  const room = getRoomById(roomId);
  if (room) {
    room.status = status;
    saveRoom(room);
  }
};

export const setCurrentQuestion = (roomId: string, index: number): void => {
  const room = getRoomById(roomId);
  if (room) {
    room.currentQuestionIndex = index;
    saveRoom(room);
  }
};

export const saveParticipant = (participant: Participant): void => {
  localStorage.setItem(PARTICIPANT_KEY, JSON.stringify(participant));
};

export const getParticipant = (): Participant | null => {
  const data = localStorage.getItem(PARTICIPANT_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearParticipant = (): void => {
  localStorage.removeItem(PARTICIPANT_KEY);
};
