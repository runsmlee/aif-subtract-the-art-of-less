/**
 * Returns today's date as YYYY-MM-DD in the user's local timezone.
 * Using toISOString().split('T')[0] returns UTC date, which can differ
 * from local date around midnight.
 */
export function getLocalDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
