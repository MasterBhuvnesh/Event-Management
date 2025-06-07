import { useCallback, useEffect, useState } from 'react';

interface UseFrameworkReadyReturn {
  ready: boolean;
  error: Error | null;
}

/**
 * Custom hook to check if the framework and dependencies are ready
 * @returns {UseFrameworkReadyReturn} Object containing ready state and error state
 */
export function useFrameworkReady(): UseFrameworkReadyReturn {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const checkFrameworkStatus = useCallback(async () => {
    try {
      setError(null);
      // Add any framework-specific checks here
      setReady(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Framework initialization failed';
      setError(new Error(errorMessage));
      console.error('[useFrameworkReady] Error:', errorMessage);
    }
  }, []);

  useEffect(() => {
    checkFrameworkStatus();
  }, [checkFrameworkStatus]);

  return { ready, error };
}
