import { useState, useEffect, useCallback } from 'react';
import { Expense, CreateExpenseInput } from '@/types/expense';
import { fetchExpenses as apiFetchExpenses, createExpense } from '@/lib/api-client';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiFetchExpenses();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const totalExpenditure = expenses.reduce((sum, exp) => sum + Math.round(exp.amount * 100), 0) / 100;

  return {
    expenses,
    isLoading,
    error,
    isSubmitting,
    addExpense,
    totalExpenditure
  };
}
