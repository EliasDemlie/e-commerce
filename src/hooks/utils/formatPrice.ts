export const FormatPrice = (amount: number) => {
  const Amount = amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
  }).format(Amount)
}
