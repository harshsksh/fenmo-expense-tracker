'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/types/expense';

interface ExpenseFormProps {
  onAddExpense: (expense: any) => Promise<boolean>;
  isSubmitting: boolean;
}

export default function ExpenseForm({ onAddExpense, isSubmitting }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    // Generate idempotency key
    const id = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const success = await onAddExpense({
      id,
      amount: parseFloat(amount),
      description,
      category,
      date,
    });

    if (success) {
      setAmount('');
      setDescription('');
    }
  };

  return (
    <section className="bg-[#161616] rounded-[20px] p-6 border border-white/5">
      <h3 className="font-data-lg text-data-lg mb-6">Quick Action</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-button-label text-zinc-500 uppercase">Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="h-12 w-full bg-zinc-900 rounded-[10px] border border-white/5 px-4 font-data-md text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-button-label text-zinc-500 uppercase">Description</label>
          <input
            type="text"
            required
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
