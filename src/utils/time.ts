/**
 * Function that runs a callback at a specific date in the future,
 * and that is resilient to browser lags, tab/window change,
 * and to existing limits on the setTimeout Javascript method.
 * It returns a cleanup method to use as return of the useEffect.
 */
export const runAt = (
  timestampMS: number,
  callback: () => void | Promise<void>
): (() => void) => {
  let timeout: NodeJS.Timeout;
  const initTimeout = (tMs: number): void => {
    const now = new Date().getTime();
    const diff = Math.max(tMs - now, 0);
    // setTimeout limit is MAX_INT32=(2^31-1)
    const MAX_INT32 = Math.pow(2, 31) - 1;
    if (diff > MAX_INT32) {
      timeout = setTimeout(() => {
        initTimeout(tMs);
      }, MAX_INT32);
    } else {
      timeout = setTimeout(callback, diff);
    }
  };
  initTimeout(timestampMS);
  // timeouts are inaccurate when the browser tab is inactive,
  // so let's set up the timeout again once the tab becomes active
  const windowVisibilityChangeListener = () => {
    clearTimeout(timeout);
    if (document.visibilityState === "visible") {
      initTimeout(timestampMS);
    }
  };
  window.document.addEventListener(
    "visibilitychange",
    windowVisibilityChangeListener
  );
  return () => {
    window.document.removeEventListener(
      "visibilitychange",
      windowVisibilityChangeListener
    );
    clearTimeout(timeout);
  };
};
