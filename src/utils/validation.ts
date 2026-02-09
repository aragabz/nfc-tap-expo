import { BusinessCard } from '../types/card';

export const MAX_NDEF_SIZE = 4096; // 4KB as a safe upper limit for common tags

export const validatePayloadSize = (card: BusinessCard): { isValid: boolean; size: number } => {
  const payload = JSON.stringify(card);
  const size = payload.length;
  
  return {
    isValid: size <= MAX_NDEF_SIZE,
    size
  };
};
