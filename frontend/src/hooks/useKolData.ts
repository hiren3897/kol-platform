import { useContext } from 'react';
import { KolContext } from '../context/KolContext';
import type { KolContextType } from '../types/kol.types';

/**
 * Custom hook to consume the KOL data context.
 * Throws an error if used outside of the KolProvider.
 */
export const useKolData = (): KolContextType => {
  const context = useContext(KolContext);
  
  if (context === undefined) {
    throw new Error('useKolData must be used within a KolProvider');
  }
  
  return context;
};