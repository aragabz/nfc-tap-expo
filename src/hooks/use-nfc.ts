import { useState, useCallback } from 'react';
import { NfcService, NfcScanOutcome } from '../services/nfc';
import { BusinessCard, ScannedCard } from '../types/card';

export const useNfc = () => {
  const [isNfcSupported, setIsNfcSupported] = useState<boolean | null>(null);
  const [isNfcEnabled, setIsNfcEnabled] = useState<boolean | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(async () => {
    await NfcService.start();
    const supported = await NfcService.isSupported();
    const enabled = await NfcService.isEnabled();
    setIsNfcSupported(supported);
    setIsNfcEnabled(enabled);
    return { supported, enabled };
  }, []);

  const writeCard = async (card: BusinessCard) => {
    setError(null);
    setIsSessionActive(true);
    try {
      await NfcService.startWriteSession(card);
    } catch (e: any) {
      setError(e.message || 'Error writing card');
      throw e;
    } finally {
      setIsSessionActive(false);
    }
  };

  const readCard = async (): Promise<NfcScanOutcome> => {
    setError(null);
    setIsSessionActive(true);
    try {
      const outcome = await NfcService.startReadSession();
      if (outcome.error) {
        setError(outcome.error);
      }
      return outcome;
    } catch (e: any) {
      const msg = e.message || 'Error reading card';
      setError(msg);
      throw e;
    } finally {
      setIsSessionActive(false);
    }
  };

  const stopSession = async () => {
    await NfcService.stopSession();
    setIsSessionActive(false);
  };

  return {
    isNfcSupported,
    isNfcEnabled,
    isSessionActive,
    error,
    checkAvailability,
    writeCard,
    readCard,
    stopSession,
  };
};
