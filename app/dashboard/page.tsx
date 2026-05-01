'use client';

import { useExpenses } from '@/hooks/useExpenses';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import DashboardLoading from './loading';
import { formatRupees } from '@/lib/money';

export default function DashboardPage() {
  const { expenses, isLoading, error, isSubmitting, addExpense, totalExpenditure } = useExpenses();

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Summary & Controls */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <section>
          <h1 className="font-h1 text-h1 text-on-surface mb-4">Dashboard Overview</h1>
          <div className="bg-[#161616] rounded-[40px] p-8 border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="font-button-label text-button-label text-on-surface-variant uppercase mb-2">Total Expenditure</p>
                <h2 className="font-hero-heading text-[48px] text-on-surface leading-none">{formatRupees(totalExpenditure)}</h2>
              </div>
              <div className="p-3 bg-primary-container/20 rounded-2xl">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              </div>
            </div>
            {/* Minimal line chart placeholder */}
            <div className="flex gap-4">
              <div className="h-4 w-24 rounded bg-surface-container-highest"></div>
              <div className="h-4 w-16 rounded bg-surface-container-highest"></div>
            </div>
          </div>
        </section>
        
        {error && (
          <div className="bg-error-container/20 border border-error/50 p-4 rounded-xl text-error text-sm font-body-sm">
            {error}
          </div>
        )}

        <ExpenseForm onAddExpense={addExpense} isSubmitting={isSubmitting} />
      </div>

      {/* Right Column: Expense List */}
      <div className="lg:col-span-7">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-h1 text-h1 text-on-surface">Recent Activity</h2>
          <button className="text-sm font-button-label text-primary hover:text-primary-fixed transition-colors">
            View All
          </button>
        </div>
        
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
}
