import { useEffect, useState } from "react";

/**
 * A `Date` that refreshes every minute, so "Open now / Closed" badges stay
 * accurate without a page reload. Pass `active: false` to pause the timer while
 * the consumer is hidden (e.g. a closed modal or dropdown).
 */
export function useNow(active = true): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!active) return;
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, [active]);

  return now;
}
