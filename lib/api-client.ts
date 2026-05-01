import { Expense, CreateExpenseInput } from '@/types/expense';

export async function fetchExpenses(filters?: { category?: string; search?: string; startDate?: string; endDate?: string }): Promise<Expense[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const queryString = params.toString();
  const url = queryString ? `/api/expenses?${queryString}` : '/api/expenses';
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
    const errorMessage = errorData?.errors?.[0]?.message || errorData?.error || 'Failed to add expense';
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function updateExpense(id: string, data: Partial<CreateExpenseInput>): Promise<Expense> {
  const res = await fetch(`/api/expenses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to update expense');
  }
  return res.json();
}

export async function deleteExpense(id: string): Promise<void> {
  const res = await fetch(`/api/expenses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to delete expense');
  }
}
