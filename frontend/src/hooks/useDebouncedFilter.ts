import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value, typically used for search inputs.
 * @param value The value to debounce (e.g., input text).
 * @param delay The delay in milliseconds (e.g., 300).
 * @returns The debounced value.
 */
export const useDebouncedFilter = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup 
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};