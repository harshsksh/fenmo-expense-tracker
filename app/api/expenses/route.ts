import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateExpenseInput } from '@/lib/validate';
import { rupeesToPaise, paiseToRupees } from '@/lib/money';
import { Category } from '@prisma/client';

function serializeExpense(expense: {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  created_at: Date;
}) {
  return {
    ...expense,
    amount: paiseToRupees(expense.amount),
    created_at: expense.created_at.getTime(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');

    const category =
      categoryParam && Object.values(Category).includes(categoryParam as Category)
        ? (categoryParam as Category)
        : undefined;

    const expenses = await prisma.expense.findMany({
      where: category ? { category } : undefined,
      orderBy: [
        { date: 'desc' },
        { created_at: 'desc' },
      ],
    });

    return NextResponse.json(expenses.map(serializeExpense));
  } catch (error) {
    console.error('[GET /api/expenses]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const errors = validateExpenseInput(body);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { id, amount, category, description, date } = body;
    const amountPaise = rupeesToPaise(parseFloat(String(amount)));

    const expense = await prisma.expense.upsert({
      where: { id: id.trim() },
      create: {
        id: id.trim(),
        amount: amountPaise,
        category: category as Category,
        description: description.trim(),
        date,
      },
      update: {},
    });

    const isNew = expense.created_at.getTime() > Date.now() - 2000;

    return NextResponse.json(
      serializeExpense(expense),
      { status: isNew ? 201 : 200 }
    );
  } catch (error) {
    console.error('[POST /api/expenses]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
