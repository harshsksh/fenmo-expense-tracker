import { Expense, CreateExpenseInput } from '@/types/expense';

export async function fetchExpenses(category?: string): Promise<Expense[]> {
  const url = category ? `/api/expenses?category=${category}` : '/api/expenses';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
}

export async function createExpense(expense: CreateExpenseInput): Promise<Expense> {
  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to add expense');
  }
  return res.json();
}
