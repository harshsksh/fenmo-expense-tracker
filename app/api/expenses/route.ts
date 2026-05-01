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
    console.log('[POST /api/expenses] Session ID:', session?.user?.id);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user actually exists in the DB (essential after a DB reset)
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });

    if (!userExists) {
      console.error('[POST /api/expenses] User not found in DB:', session.user.id);
      return NextResponse.json({ 
        error: 'User session invalid. Please log out and log back in.' 
      }, { status: 401 });
    }

    const body = await request.json();
    console.log('[POST /api/expenses] Body:', body);

    const errors = validateExpenseInput(body);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { id, amount, category, description, date } = body;
    const amountPaise = rupeesToPaise(parseFloat(String(amount)));

    try {
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

      const isNew = expense.created_at.getTime() > Date.now() - 5000;

      return NextResponse.json(
        serializeExpense(expense),
        { status: isNew ? 201 : 200 }
      );
    } catch (prismaError: any) {
      console.error('[POST /api/expenses] Prisma Error:', prismaError);
      return NextResponse.json({ error: prismaError.message || 'Database error' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[POST /api/expenses] General Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
