// Text limits shared by the API and the form fields, so the two never disagree.
export const TEXT_LIMITS = { title: 80, description: 500, notes: 1000 } as const;

// Trim and cap free text from a request; non-strings become undefined.
export function clampText(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  return Array.from(value.trim()).slice(0, max).join('');
}
