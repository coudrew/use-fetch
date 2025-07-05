import { useEffect, useState, useRef, useCallback } from "react";

interface UseFetchParams {
  url: string;
  options?: RequestInit;
}

export function useFetch<T>({ url, options = {} }: UseFetchParams) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const abortControllerRef = useRef<AbortController | null>(null);
  const hasInitialized = useRef<boolean>(false);

  const refetch = useCallback(() => {
    hasInitialized.current = false;
  }, [hasInitialized]);

  const fetchData = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);

    fetch(url, {
      method: "GET",
      ...options,
      signal: abortController.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        if (!abortController.signal.aborted) {
          setData(result);
        }
      })
      .catch((err) => {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });
  }, [url, options]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchData();
    }
  }, []);

  return {
    data,
    error,
    isLoading,
    refetch,
    abortController: abortControllerRef.current,
  };
}
