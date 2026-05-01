import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateExpenseInput } from '@/lib/validate';
import { rupeesToPaise, paiseToRupees } from '@/lib/money';
import { Category, CATEGORIES } from '@/types/expense';
import { auth } from '@/auth';

function serializeExpense(expense: {
  id: string;
  amount: number;
  category: string;
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const category =
      categoryParam && CATEGORIES.includes(categoryParam as any)
        ? (categoryParam as any)
        : undefined;

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.user.id,
        ...(category ? { category } : {}),
        ...(searchParam ? { description: { contains: searchParam, mode: 'insensitive' } } : {}),
        ...(startDateParam || endDateParam ? {
          date: {
            ...(startDateParam ? { gte: startDateParam } : {}),
            ...(endDateParam ? { lte: endDateParam } : {}),
          }
        } : {})
      },
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        category: category as any,
        description: description.trim(),
        date,
        userId: session.user.id,
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
