export function createAsyncStore<T>(fetcher: () => Promise<T>) {
  let data = $state<T | null>(null);
  let isLoading = $state(true);
  let error = $state<Error | null>(null);
  let fetchCount = $state(0);

  $effect(() => {
    fetchCount + 0;

    let cancelled = false;
    isLoading = true;
    error = null;

    fetcher()
      .then((result) => {
        if (!cancelled) data = result;
      })
      .catch((err) => {
        if (!cancelled) error = err instanceof Error ? err : new Error(String(err));
      })
      .finally(() => {
        if (!cancelled) isLoading = false;
      });

    return () => { cancelled = true; };
  });

  return {
    get data() { return data; },
    get isLoading() { return isLoading; },
    get error() { return error; },
    refetch() { fetchCount++; },
  };
}
