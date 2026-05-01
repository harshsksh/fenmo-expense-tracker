import { useState, useEffect, useCallback } from 'react';
import { Expense, CreateExpenseInput } from '@/types/expense';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
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
    // Optimistic update
    const optimisticExpense: Expense = {
      ...expenseInput,
      created_at: Date.now(),
      amountPaise: Math.round(expenseInput.amount * 100)
    };
    
    setExpenses(prev => [optimisticExpense, ...prev]);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseInput),
      });
      
      if (!res.ok) {
        throw new Error('Failed to add expense');
      }
      
      const savedExpense = await res.json();
      // Replace optimistic expense with saved one
      setExpenses(prev => prev.map(e => e.id === optimisticExpense.id ? savedExpense : e));
      return true;
    } catch (err: any) {
      // Revert optimistic update
      setExpenses(prev => prev.filter(e => e.id !== optimisticExpense.id));
      setError(err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpenditure = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    expenses,
    isLoading,
    error,
    isSubmitting,
    addExpense,
    totalExpenditure
  };
}
