// Text limits shared by the API and the form fields, so the two never disagree.
export const TEXT_LIMITS = { title: 80, description: 500, notes: 1000 } as const;

// Trim and cap free text from a request; non-strings become undefined.
export function clampText(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  return Array.from(value.trim()).slice(0, max).join('');
}

// Ids the app makes on the device for records created offline (prefix + UUID), so a change
// replayed after reconnecting lands on the same row instead of creating a second one.
export function clientId(value: unknown, prefix: 'ses' | 'set' | 'rtn'): string | undefined {
  if (typeof value !== 'string') return undefined;
  return new RegExp(`^${prefix}_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`, 'i').test(value) ? value : undefined;
}

// When something happened on the device (it may reach the server hours later). Accepts an ISO
// time from the last 14 days, allowing a few minutes of clock skew; anything else is "now".
export function clientTime(value: unknown, now: Date = new Date()): string {
  if (typeof value === 'string') {
    const t = Date.parse(value);
    const ms = now.getTime();
    if (Number.isFinite(t) && t <= ms + 5 * 60_000 && t >= ms - 14 * 86_400_000) {
      return new Date(Math.min(t, ms)).toISOString();
    }
  }
  return now.toISOString();
}
