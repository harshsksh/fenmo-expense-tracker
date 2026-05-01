'use client';

import { useState, useEffect, useMemo } from 'react';
import { Expense, CATEGORIES } from '@/types/expense';
import { formatRupees } from '@/lib/money';

interface Budget {
  category: string;
  amount: number;
}

export default function BudgetProgress({ expenses }: { expenses: Expense[] }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/budget')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBudgets(data);
          const vals: Record<string, string> = {};
          data.forEach((b: Budget) => {
            vals[b.category] = b.amount.toString();
          });
          setEditValues(vals);
        } else {
          setBudgets([]);
        }
      })
      .catch(() => setBudgets([]));
  }, []);

  // Calculate current month spending per category
  const currentMonthSpending = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const map: Record<string, number> = {};
    expenses
      .filter((e) => e.date.startsWith(prefix))
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
      });
    return map;
  }, [expenses]);

  const handleSave = async () => {
    setIsEditing(false);
    for (const category of CATEGORIES) {
      const amount = parseFloat(editValues[category] || '0');
      if (amount > 0) {
        await fetch('/api/budget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, amount }),
        });
      }
    }
    // Refresh budgets
    const res = await fetch('/api/budget');
    const data = await res.json();
    setBudgets(data);
  };

  const activeBudgets = budgets.filter((b) => b.amount > 0);

  return (
    <section className="bg-surface-container rounded-[20px] p-6 border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-data-lg text-data-lg text-on-surface">Monthly Budgets</h3>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="text-xs font-button-label text-primary hover:underline"
        >
          {isEditing ? 'Save Budgets' : 'Manage'}
        </button>
      </div>

      <div className="space-y-6">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase">{cat}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={editValues[cat] || ''}
                  onChange={(e) => setEditValues({ ...editValues, [cat]: e.target.value })}
                  className="h-9 bg-zinc-900 border border-white/5 rounded-lg px-3 text-xs text-on-surface focus:outline-none focus:border-primary/50"
                />
              </div>
            ))}
          </div>
        ) : activeBudgets.length > 0 ? (
          activeBudgets.map((budget) => {
            const spent = currentMonthSpending[budget.category] || 0;
            const percent = Math.min((spent / budget.amount) * 100, 100);
            const isOver = spent > budget.amount;

            return (
              <div key={budget.category} className="space-y-2">
                <div className="flex justify-between text-xs font-body-sm">
                  <span className="text-on-surface">{budget.category}</span>
                  <span className={isOver ? 'text-error' : 'text-on-surface-variant'}>
                    {formatRupees(spent)} / {formatRupees(budget.amount)}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isOver ? 'bg-error' : 'bg-primary'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-on-surface-variant text-center py-4 italic">
            No budgets set. Click Manage to set limits.
          </p>
        )}
      </div>
    </section>
  );
}
