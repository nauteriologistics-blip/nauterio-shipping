/**
 * Money is always integer minor units + ISO currency, never a float.
 * Source of truth: CLAUDE.md engineering rules; spec section 23.2.
 */
export interface Money {
  amountMinorUnits: number;
  currency: "EUR" | "USD";
}

export function money(amountMinorUnits: number, currency: Money["currency"]): Money {
  if (!Number.isInteger(amountMinorUnits)) {
    throw new Error(`Money amount must be an integer minor-unit value, got ${amountMinorUnits}`);
  }
  if (amountMinorUnits < 0) {
    throw new Error(`Money amount must not be negative, got ${amountMinorUnits}`);
  }
  return { amountMinorUnits, currency };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add ${a.currency} to ${b.currency}`);
  }
  return money(a.amountMinorUnits + b.amountMinorUnits, a.currency);
}

export function formatMoney(m: Money, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: m.currency }).format(
    m.amountMinorUnits / 100
  );
}
