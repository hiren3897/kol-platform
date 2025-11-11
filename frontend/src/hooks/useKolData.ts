import { useContext } from 'react';
import { KolContext } from '../context/KolContext';
import type { KolContextType } from '../types/kol.types';

export const useKolData = (): KolContextType => {
  const context = useContext(KolContext);
  
  if (context === undefined) {
    throw new Error('useKolData must be used within a KolProvider');
  }
  
  return context;
};