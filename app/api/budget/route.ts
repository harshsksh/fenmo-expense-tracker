import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { rupeesToPaise, paiseToRupees } from '@/lib/money';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const budgets = await prisma.budget.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(
      budgets.map((b) => ({
        ...b,
        limit: paiseToRupees(b.limitPaise),
      }))
    );
  } catch (error) {
    console.error('[GET /api/budget]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, amount } = await request.json();
    const amountPaise = rupeesToPaise(parseFloat(String(amount)));

    const budget = await prisma.budget.upsert({
      where: {
        userId_category: {
          userId: session.user.id,
          category: category as any,
        },
      },
      create: {
        userId: session.user.id,
        category: category as any,
        limitPaise: amountPaise,
      },
      update: {
        limitPaise: amountPaise,
      },
    });

    return NextResponse.json({
      ...budget,
      limit: paiseToRupees(budget.limitPaise),
    });
  } catch (error) {
    console.error('[POST /api/budget]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
