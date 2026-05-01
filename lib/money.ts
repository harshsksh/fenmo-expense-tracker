// Rupees (float) → Paise (integer) — use when SAVING to DB
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

// Paise (integer) → Rupees (float) — use when READING from DB
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

// Format rupees for display: 1234.5 → "₹1,234.50"
export function formatRupees(rupees: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(rupees);
}
