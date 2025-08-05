import { useRef, useCallback } from "react";

/**
 * 함수 호출을 throttle하는 훅
 * @param callback 실행할 콜백 함수
 * @param delay throttle 간격 (ms)
 * @returns throttled 함수
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = performance.now();

      if (now - lastCallRef.current >= delay) {
        callback(...args);
        lastCallRef.current = now;
      }
    },
    [callback, delay]
  ) as T;
};

/**
 * 함수 호출을 debounce하는 훅
 * @param callback 실행할 콜백 함수
 * @param delay debounce 간격 (ms)
 * @returns debounced 함수
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<number | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay) as unknown as number;
    },
    [callback, delay]
  ) as T;
};

export default { useThrottle, useDebounce };
