export interface Expense {
  id: string;
  amount: number;
  amountPaise: number;
  category: string;
  description: string;
  date: string;
  created_at: number;
}

export type CreateExpenseInput = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Other',
] as const;

export type Category = typeof CATEGORIES[number];
