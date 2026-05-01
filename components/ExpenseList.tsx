'use client';

import { Expense } from '@/types/expense';
import { formatRupees } from '@/lib/money';

const CategoryIcons: Record<string, string> = {
  Food: 'restaurant',
  Transport: 'directions_car',
  Shopping: 'shopping_bag',
  Bills: 'receipt_long',
  Health: 'medical_services',
  Entertainment: 'movie',
  Other: 'category'
};

interface ExpenseListProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, onEdit }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant font-body-sm border border-dashed border-white/10 rounded-[20px]">
        No recent activity. Track your first expense!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => {
        const icon = CategoryIcons[expense.category] || 'category';
        
        return (
          <div
            key={expense.id}
            onClick={() => onEdit?.(expense)}
            className="bg-[#161616] rounded-[20px] p-5 flex items-center justify-between border border-white/5 hover:border-primary/20 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all shrink-0">
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <div className="space-y-1">
                <div className="font-h1 text-base text-on-surface">{expense.description}</div>
                <div className="font-data-md text-xs text-on-surface-variant/70 flex gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/5">{expense.category}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5">{expense.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-data-lg text-lg text-on-surface">
                {formatRupees(expense.amount)}
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors text-[20px]">
                edit
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
