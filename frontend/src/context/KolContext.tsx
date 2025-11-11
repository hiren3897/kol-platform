import { createContext } from 'react';
import type { KolContextType } from '../types/kol.types';

export const KolContext = createContext<KolContextType | undefined>(undefined);