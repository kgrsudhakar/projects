export function generatePolicyNumber(
  count: number
): string {
  const year = new Date().getFullYear();

  return `POL-${year}-${String(count + 1).padStart(
    6,
    "0"
  )}`;
}