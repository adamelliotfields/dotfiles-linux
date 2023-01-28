/**
 * Sleep for a duration.
 * @example
 * ```ts
 * await sleep(1000);
 * ```
 */
export default function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
