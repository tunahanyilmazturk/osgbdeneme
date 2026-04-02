"use client";

import { useMemo, useCallback } from "react";

// Custom hook for expensive filtering operations with memoization
export function useFilteredData<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  sortFn?: (a: T, b: T) => number,
  deps: unknown[] = []
): T[] {
  return useMemo(() => {
    let result = data.filter(filterFn);
    if (sortFn) {
      result = result.sort(sortFn);
    }
    return result;
  }, [data, filterFn, sortFn, ...deps]);
}

// Debounce hook for search inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let currentValue = value;

    const setValue = (newValue: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        currentValue = newValue;
      }, delay);
    };

    return [currentValue, setValue];
  }, [delay]);

  useMemo(() => {
    setDebouncedValue(value);
  }, [value, setDebouncedValue]);

  return debouncedValue;
}

// Optimized selector hook for Zustand stores
export function useStoreSelector<T, U>(
  store: () => T,
  selector: (state: T) => U
): U {
  const state = store();
  return useMemo(() => selector(state), [state, selector]);
}

// Memoized event handler creator
export function useMemoizedCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
  deps: unknown[]
): T {
  return useCallback(fn, deps);
}

// Throttle hook for high-frequency operations
export function useThrottle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): T {
  const throttleRef = useMemo(() => {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, [fn, limit]);

  return throttleRef as T;
}

// Optimized search with early return
export function createSearchFilter<T>(
  fields: (keyof T)[],
  searchTerm: string
): (item: T) => boolean {
  if (!searchTerm) return () => true;
  
  const lowerTerm = searchTerm.toLowerCase();
  return (item: T) => {
    for (const field of fields) {
      const value = item[field];
      if (typeof value === 'string' && value.toLowerCase().includes(lowerTerm)) {
        return true;
      }
    }
    return false;
  };
}

// Paginated data hook
export function usePagination<T>(
  data: T[],
  pageSize: number,
  currentPage: number
): { paginatedData: T[]; totalPages: number } {
  return useMemo(() => {
    const totalPages = Math.ceil(data.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return {
      paginatedData: data.slice(start, end),
      totalPages: Math.max(1, totalPages),
    };
  }, [data, pageSize, currentPage]);
}
