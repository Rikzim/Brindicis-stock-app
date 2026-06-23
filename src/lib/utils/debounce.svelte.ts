/**
 * Creates a debounced value tied to a source getter.
 * Returns an object with a `current` getter that updates after the delay.
 *
 * @example
 *   const debouncedSearch = createDebounced(() => searchQuery, 300);
 *   $effect(() => { console.log(debouncedSearch.current); });
 */
export function createDebounced<T>(getSource: () => T, delay: number) {
  let value = $state<T>(getSource());
  let timer: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    const next = getSource();
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      value = next;
    }, delay);
    return () => {
      if (timer) clearTimeout(timer);
    };
  });

  return {
    get current() {
      return value;
    },
  };
}
