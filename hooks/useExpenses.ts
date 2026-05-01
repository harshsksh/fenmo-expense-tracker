import { useState, useEffect, useCallback } from 'react';
import { Expense, CreateExpenseInput } from '@/types/expense';
import {
  fetchExpenses as apiFetchExpenses,
  createExpense,
  updateExpense as apiUpdateExpense,
  deleteExpense as apiDeleteExpense,
} from '@/lib/api-client';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<{ category?: string; search?: string; startDate?: string; endDate?: string }>({});

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiFetchExpenses(filters);
      setExpenses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (expenseInput: CreateExpenseInput) => {
    const optimisticExpense: Expense = {
      ...expenseInput,
      created_at: Date.now(),
      amountPaise: Math.round(expenseInput.amount * 100)
    };
    
    setExpenses(prev => [optimisticExpense, ...prev]);
    setIsSubmitting(true);
    setError(null);

    try {
      const savedExpense = await createExpense(expenseInput);
      setExpenses(prev => prev.map(e => e.id === optimisticExpense.id ? savedExpense : e));
      return true;
    } catch (err: any) {
      setExpenses(prev => prev.filter(e => e.id !== optimisticExpense.id));
      setError(err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editExpense = async (id: string, data: Partial<CreateExpenseInput>) => {
    // Optimistic update
    const original = expenses.find(e => e.id === id);
    if (!original) return false;

    setExpenses(prev =>
      prev.map(e => (e.id === id ? { ...e, ...data } : e))
    );
    setError(null);

    try {
      const updated = await apiUpdateExpense(id, data);
      setExpenses(prev => prev.map(e => (e.id === id ? updated : e)));
      return true;
    } catch (err: any) {
      // Rollback
      setExpenses(prev => prev.map(e => (e.id === id ? original : e)));
      setError(err.message);
      return false;
    }
  };

  const removeExpense = async (id: string) => {
    const original = expenses.find(e => e.id === id);
    if (!original) return false;

    // Optimistic removal
    setExpenses(prev => prev.filter(e => e.id !== id));
    setError(null);

    try {
      await apiDeleteExpense(id);
      return true;
    } catch (err: any) {
      // Rollback
      setExpenses(prev => [original, ...prev]);
      setError(err.message);
      return false;
    }
  };

  const totalExpenditure = expenses.reduce((sum, exp) => sum + Math.round(exp.amount * 100), 0) / 100;

  return {
    expenses,
    isLoading,
    error,
    isSubmitting,
    addExpense,
    editExpense,
    removeExpense,
    totalExpenditure,
    setFilters
  };
}
