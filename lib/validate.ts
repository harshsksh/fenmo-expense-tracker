import { CATEGORIES } from '@/types/expense';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateExpenseInput(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!body || typeof body !== 'object') return [{ field: 'body', message: 'Invalid request body' }];

  const b = body as Record<string, unknown>;

  // id
  if (!b.id || typeof b.id !== 'string' || b.id.trim() === '')
    errors.push({ field: 'id', message: 'id is required' });

  // amount
  const amount = parseFloat(String(b.amount));
  if (isNaN(amount) || amount <= 0)
    errors.push({ field: 'amount', message: 'Amount must be a positive number' });
  if (amount > 999999)
    errors.push({ field: 'amount', message: 'Amount cannot exceed ₹9,99,999' });

  // category
  if (!CATEGORIES.includes(b.category as any))
    errors.push({ field: 'category', message: 'Invalid category' });

  // description
  if (!b.description || typeof b.description !== 'string' || b.description.trim() === '')
    errors.push({ field: 'description', message: 'Description is required' });
  if (typeof b.description === 'string' && b.description.length > 200)
    errors.push({ field: 'description', message: 'Description max 200 characters' });

  // date
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!b.date || !dateRegex.test(String(b.date)) || isNaN(Date.parse(String(b.date))))
    errors.push({ field: 'date', message: 'Date must be a valid YYYY-MM-DD string' });

  return errors;
}
