'use client';

import { useState, useEffect, useMemo } from 'react';
import { Expense, CATEGORIES } from '@/types/expense';
import { formatRupees } from '@/lib/money';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#7dd6c6',
  Transport: '#d7bedd',
  Shopping: '#ffb4ab',
  Bills: '#afcebd',
  Health: '#99f3e2',
  Entertainment: '#f4dafa',
  Other: '#889390',
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function InsightsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  useEffect(() => {
    fetch('/api/expenses')
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // ---- Current month expenses ----
  const currentMonthExpenses = useMemo(() => {
    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    return expenses.filter((e) => e.date.startsWith(prefix));
  }, [expenses, currentYear, currentMonth]);

  // ---- All-time category data (Doughnut) ----
  const allTimeCategoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // ---- Current month category data (Doughnut) ----
  const monthCategoryData = useMemo(() => {
    const map: Record<string, number> = {};
    currentMonthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [currentMonthExpenses]);

  // ---- Daily spending for last 7 days (Bar chart) ----
  const dailyData = useMemo(() => {
    const today = new Date();
    const days: { label: string; date: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      days.push({ label: dayLabel, date: dateStr, total: 0 });
    }
    expenses.forEach((e) => {
      const match = days.find((d) => d.date === e.date);
      if (match) match.total += e.amount;
    });
    return days.map((d) => ({ name: d.label, amount: Math.round(d.total * 100) / 100 }));
  }, [expenses]);

  // ---- Monthly spending trend (last 6 months) ----
  const monthlyTrend = useMemo(() => {
    const result: { name: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const prefix = `${y}-${String(m + 1).padStart(2, '0')}`;
      const total = expenses
        .filter((e) => e.date.startsWith(prefix))
        .reduce((s, e) => s + e.amount, 0);
      result.push({
        name: MONTHS[m].substring(0, 3),
        amount: Math.round(total * 100) / 100,
      });
    }
    return result;
  }, [expenses, currentYear, currentMonth]);

  // Summary stats
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const monthSpent = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const topCategory = allTimeCategoryData.length > 0 ? allTimeCategoryData[0] : null;
  const avgPerDay = totalSpent > 0 ? totalSpent / 30 : 0;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="font-data-md text-xs text-on-surface-variant mb-1">{label}</p>
        <p className="font-data-lg text-on-surface">{formatRupees(payload[0].value)}</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" style={{ width: 32, height: 32 }}></div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-6xl text-zinc-600">insights</span>
        <h2 className="font-h1 text-h1 text-on-surface">No Data Yet</h2>
        <p className="text-on-surface-variant font-body-sm max-w-md text-center">
          Start tracking your expenses to see beautiful insights and spending analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-h1 text-h1 text-on-surface">Insights</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container rounded-[20px] p-6 border border-white/5">
          <p className="font-button-label text-button-label text-on-surface-variant uppercase mb-2">All-Time Spent</p>
          <h3 className="font-data-lg text-2xl text-on-surface">{formatRupees(totalSpent)}</h3>
        </div>
        <div className="bg-[#161616] rounded-[20px] p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
          <p className="font-button-label text-button-label text-on-surface-variant uppercase mb-2">{MONTHS[currentMonth]} Spent</p>
          <h3 className="font-data-lg text-2xl text-primary">{formatRupees(monthSpent)}</h3>
        </div>
        <div className="bg-surface-container rounded-[20px] p-6 border border-white/5">
          <p className="font-button-label text-button-label text-on-surface-variant uppercase mb-2">Avg / Day</p>
          <h3 className="font-data-lg text-2xl text-on-surface">{formatRupees(Math.round(avgPerDay * 100) / 100)}</h3>
        </div>
        <div className="bg-surface-container rounded-[20px] p-6 border border-white/5">
          <p className="font-button-label text-button-label text-on-surface-variant uppercase mb-2">Top Category</p>
          <h3 className="font-data-lg text-2xl text-on-surface">{topCategory?.name ?? '—'}</h3>
          {topCategory && (
            <p className="text-xs text-on-surface-variant font-data-md mt-1">{formatRupees(topCategory.value)}</p>
          )}
        </div>
      </div>

      {/* Charts Row 1: All-Time vs Current Month Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* All-Time Doughnut */}
        <div className="bg-surface-container rounded-[20px] p-6 border border-white/5">
          <h3 className="font-data-lg text-data-lg text-on-surface mb-6">All-Time by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allTimeCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                animationBegin={0}
                animationDuration={800}
              >
                {allTimeCategoryData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#889390'} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0];
                  return (
                    <div className="bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
                      <p className="font-data-md text-xs text-on-surface-variant mb-1">{d.name}</p>
                      <p className="font-data-lg text-on-surface">{formatRupees(d.value as number)}</p>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: '13px', color: '#bdc9c5' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Current Month Doughnut */}
        <div className="bg-surface-container rounded-[20px] p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-data-lg text-data-lg text-on-surface">{MONTHS[currentMonth]} Breakdown</h3>
            <span className="text-xs font-data-md text-primary px-3 py-1 rounded-full bg-primary/10">
              Current Month
            </span>
          </div>
          {monthCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={monthCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  animationBegin={200}
                  animationDuration={800}
                >
                  {monthCategoryData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#889390'} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0];
                    return (
                      <div className="bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
                        <p className="font-data-md text-xs text-on-surface-variant mb-1">{d.name}</p>
                        <p className="font-data-lg text-on-surface">{formatRupees(d.value as number)}</p>
                      </div>
                    );
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: '13px', color: '#bdc9c5' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-3 text-zinc-600">event_busy</span>
              <p className="font-body-sm">No expenses this month yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2: Daily & Monthly trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart – Last 7 Days */}
        <div className="bg-[#161616] rounded-[20px] p-6 border border-white/5">
          <h3 className="font-data-lg text-data-lg text-on-surface mb-6">Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#889390', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#889390', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#7dd6c6" animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart – Monthly Trend (last 6 months) */}
        <div className="bg-[#161616] rounded-[20px] p-6 border border-white/5">
          <h3 className="font-data-lg text-data-lg text-on-surface mb-6">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#889390', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#889390', fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#d7bedd" animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-[#161616] rounded-[20px] p-6 border border-white/5">
        <h3 className="font-data-lg text-data-lg text-on-surface mb-6">Category Breakdown</h3>
        <div className="space-y-3">
          {allTimeCategoryData.map((cat) => {
            const pct = totalSpent > 0 ? (cat.value / totalSpent) * 100 : 0;
            return (
              <div key={cat.name} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: CATEGORY_COLORS[cat.name] || '#889390' }}
                />
                <span className="font-body-sm text-on-surface w-28">{cat.name}</span>
                <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: CATEGORY_COLORS[cat.name] || '#889390',
                    }}
                  />
                </div>
                <span className="font-data-md text-on-surface-variant w-20 text-right">{formatRupees(cat.value)}</span>
                <span className="font-data-md text-on-surface-variant/60 w-12 text-right">{pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
