import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to toggle a boolean state.
 * @param initialValue - The initial boolean value.
 * @returns A tuple with the current state and a function to toggle it.
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);
  const toggle = (): void => {
    setValue((v) => !v);
  };
  return [value, toggle];
}

/**
 * Custom hook to track the previous value of a state or prop.
 * @param value - The value to track.
 * @returns The previous value, or undefined on the first render.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
