'use client';

import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/types/expense';

interface ExpenseFormProps {
  onAddExpense: (expense: any) => Promise<boolean>;
  isSubmitting: boolean;
}

function generateId() {
  return `exp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export default function ExpenseForm({ onAddExpense, isSubmitting }: ExpenseFormProps) {
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Generate ID on mount to prevent hydration mismatch and ensure stable key for retries
  useEffect(() => {
    setIdempotencyKey(generateId());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !idempotencyKey) return;

    const success = await onAddExpense({
      id: idempotencyKey,
      amount: parseFloat(amount),
      description: description.trim(),
      category,
      date,
    });

    if (success) {
      setAmount('');
      setDescription('');
      setIdempotencyKey(generateId()); // Regenerate only on success
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="bg-surface-container rounded-[20px] p-6 border border-white/5">
      <h3 className="font-data-lg text-data-lg mb-6">Quick Action</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-button-label text-zinc-500 uppercase">Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5 px-4 font-data-md text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-xs font-button-label text-zinc-500 uppercase">Description</label>
            <span className="text-xs font-data-md text-zinc-600">{description.length}/200</span>
          </div>
          <input
            type="text"
            required
            maxLength={200}
            autoComplete="off"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5 px-4 font-body-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-button-label text-zinc-500 uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5 px-4 font-body-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors appearance-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-button-label text-zinc-500 uppercase">Date</label>
            <input
              type="date"
              required
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5 px-4 font-data-md text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`mt-6 w-full bg-primary-container ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-container/80 hover:scale-[1.02]'} transition-all text-on-primary-container h-14 rounded-[10px] flex items-center justify-center gap-3`}
        >
          {isSubmitting ? (
            <>
              <div className="spinner"></div>
              <span className="font-button-label text-button-label">Saving...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="font-button-label text-button-label">Add Expense</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
