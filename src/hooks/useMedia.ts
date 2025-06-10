import { useEffect, useState } from 'react';

export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

export type Breakpoint = keyof typeof breakpoints;

type UseMediaOptions =
  | { below: Breakpoint }
  | { above: Breakpoint }
  | { only: Breakpoint }
  | { from: Breakpoint; to: Breakpoint }
  | { min?: number; max?: number };

const getMediaQuery = (options: UseMediaOptions): string => {
  if ('below' in options) {
    const max = breakpoints[options.below] - 0.02;
    return `(max-width: ${max}px)`;
  }

  if ('above' in options) {
    return `(min-width: ${breakpoints[options.above]}px)`;
  }

  if ('only' in options) {
    const keys = Object.keys(breakpoints) as Breakpoint[];
    const current = breakpoints[options.only];
    const index = keys.indexOf(options.only);
    const nextKey = keys[index + 1];
    const max = nextKey ? breakpoints[nextKey] - 0.02 : undefined;

    if (max !== undefined) {
      return `(min-width: ${current}px) and (max-width: ${max}px)`;
    }
    return `(min-width: ${current}px)`;
  }

  if ('from' in options && 'to' in options) {
    const min = breakpoints[options.from];
    const max = breakpoints[options.to] - 0.02;
    return `(min-width: ${min}px) and (max-width: ${max}px)`;
  }

  if ('min' in options || 'max' in options) {
    const queries: string[] = [];
    if (options.min !== undefined) {
      queries.push(`(min-width: ${options.min}px)`);
    }
    if (options.max !== undefined) {
      queries.push(`(max-width: ${options.max}px)`);
    }
    return queries.join(' and ');
  }

  return '';
};

export const useMedia = (options: UseMediaOptions): boolean => {
  const query = getMediaQuery(options);
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};
