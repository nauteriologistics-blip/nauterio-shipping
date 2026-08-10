export function formatMoney(minorUnits: string | number, currency: string): string {
  const value = Number(minorUnits) / 100;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export function formatDateRange(fromIso: string | null, toIso: string | null): string {
  if (!fromIso && !toIso) return "Not yet scheduled";
  if (fromIso && toIso) return `${formatDate(fromIso)} - ${formatDate(toIso)}`;
  return formatDate(fromIso ?? toIso);
}
