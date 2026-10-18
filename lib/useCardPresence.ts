import { useEffect, useState } from "react";

/** Keep a dismissed card mounted long enough to finish its fade out. */
export function useCardPresence<T>(value: T | undefined, exitMs = 300) {
  const [retained, setRetained] = useState(value);
  useEffect(() => {
    if (value !== undefined) { setRetained(value); return; }
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : exitMs;
    const timer = window.setTimeout(() => setRetained(undefined), duration);
    return () => clearTimeout(timer);
  }, [value, exitMs]);
  return { value: value ?? retained, exiting: value === undefined && retained !== undefined };
}
