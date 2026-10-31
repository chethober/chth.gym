export interface Translator {
  /** The translation of a piece of text (surrounding spaces kept), or null when nothing changes. */
  translate(text: string | null | undefined): string | null;
  localDigits(text: string): string;
}
export function makeTranslator(dict: Record<string, string>, locale: string): Translator;
