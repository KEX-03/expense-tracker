export function uid() {
  return crypto.randomUUID();
}

export function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}
