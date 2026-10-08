/**
 * Resolves a file in /public to a URL. Kept as a function so the single-file
 * preview build can swap in embedded copies of the same files.
 */
export function asset(path: string): string {
  return path;
}
