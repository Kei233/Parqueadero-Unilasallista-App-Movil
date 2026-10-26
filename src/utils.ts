/** Formato de moneda COP, p. ej. $6.000 (manual para no depender de Intl en Hermes). */
export function cop(value: number): string {
  return "$" + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const pad = (n: number) => n.toString().padStart(2, "0");

/** Ej: 25 de octubre de 2026, 14:03:09 */
export function formatDateTime(date: Date): string {
  return (
    `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}, ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/** Genera un código de transacción con la forma UNILA-2026-X89F2. */
export function generateTxCode(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `UNILA-${year}-${random}`;
}

/** Serie determinística de anchos para dibujar el "código de barras" decorativo. */
export function codeToBarWidths(code: string, bars = 28): number[] {
  const widths: number[] = [];
  for (let i = 0; i < bars; i++) {
    const char = code.charCodeAt(i % code.length);
    widths.push(1 + (char % 4));
  }
  return widths;
}
