'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import EditExpenseDrawer from '@/components/EditExpenseDrawer';
import SearchBar from '@/components/SearchBar';
import BudgetProgress from '@/components/BudgetProgress';
import DashboardLoading from './loading';
import { formatRupees } from '@/lib/money';
import { Expense } from '@/types/expense';

export default function DashboardPage() {
  const { expenses, isLoading, error, isSubmitting, addExpense, editExpense, removeExpense, totalExpenditure, setFilters } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Summary & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <section>
            <h1 className="font-h1 text-h1 text-on-surface mb-4">Dashboard Overview</h1>
            <div className="bg-surface-container rounded-[40px] p-8 border border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="font-button-label text-button-label text-on-surface-variant uppercase mb-2">Total Expenditure</p>
                  <h2 className="font-hero-heading text-[48px] text-on-surface leading-none">{formatRupees(totalExpenditure)}</h2>
                </div>
                <div className="p-3 bg-primary-container/20 rounded-2xl">
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                </div>
              </div>
              {/* Stats row */}
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-xl bg-surface-container-highest/30">
                  <span className="font-data-md text-xs text-on-surface-variant">{expenses.length} expenses</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-surface-container-highest/30">
                  <span className="font-data-md text-xs text-on-surface-variant">
                    Avg {formatRupees(expenses.length > 0 ? totalExpenditure / expenses.length : 0)}
                  </span>
                </div>
              </div>
            </div>
          </section>
          
          <BudgetProgress expenses={expenses} />

          {error && (
            <div className="bg-error-container/20 border border-error/50 p-4 rounded-xl text-error text-sm font-body-sm">
              {error}
            </div>
          )}

          <ExpenseForm onAddExpense={addExpense} isSubmitting={isSubmitting} />
        </div>

        {/* Right Column: Expense List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="font-h1 text-h1 text-on-surface">Recent Activity</h2>
            
          </div>

          <SearchBar onSearch={setFilters} />
          
          <ExpenseList expenses={expenses} onEdit={setEditingExpense} />
        </div>
      </div>

      {/* Edit Drawer */}
      {editingExpense && (
        <EditExpenseDrawer
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={editExpense}
          onDelete={removeExpense}
        />
      )}
    </>
  );
}
