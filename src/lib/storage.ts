import { Participant } from '@/types/game';

const PARTICIPANT_KEY = 'unboxing_participant';

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
