import { Payment } from '@prisma/client';
import currency from 'currency.js';

export function calculatePriceTaxAndTotal(payment: Payment) {
  return {
    ...payment,
    price: calculatePrice(payment),
    tax: calculateTax(payment),
    total: calculateTotal(payment),
  };
}

function calculatePrice({ isExempt, amount }: Payment) {
  const price = isExempt ? currency(amount) : currency(amount).divide(1.08125);
  return price.toString();
}

function calculateTax(payment: Payment) {
  const tax = payment.isExempt
    ? currency(0)
    : currency(calculatePrice(payment)).multiply(0.08125);
  return tax.toString();
}

function calculateTotal({ amount }: Payment) {
  return currency(amount).toString();
}
