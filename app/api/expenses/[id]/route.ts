import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { rupeesToPaise, paiseToRupees } from '@/lib/money';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify ownership
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.expense.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/expenses/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};
    if (body.amount !== undefined) {
      if (typeof body.amount !== 'number' || body.amount < 0.01) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
      }
      updateData.amount = rupeesToPaise(body.amount);
    }
    if (body.description !== undefined) {
      if (typeof body.description !== 'string' || body.description.length > 200) {
        return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
      }
      updateData.description = body.description.trim();
    }
    if (body.category !== undefined) {
      updateData.category = body.category as any;
    }
    if (body.date !== undefined) {
      updateData.date = body.date;
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ...updated,
      amount: paiseToRupees(updated.amount),
      created_at: updated.created_at.getTime(),
    });
  } catch (error) {
    console.error('[PATCH /api/expenses/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
