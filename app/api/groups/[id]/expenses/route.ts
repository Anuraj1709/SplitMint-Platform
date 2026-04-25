import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Group from '@/models/Group';
import Expense from '@/models/Expense';
import { getUserFromToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { description, amount, date, payerId, splitType, splits } = await request.json();

    if (!description || !amount || !payerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Check if group exists and belongs to user
    const group = await Group.findOne({ _id: params.id, owner: user._id }).populate('participants');
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Check if payer is in group
    if (!group.participants.some((p: any) => p._id.toString() === payerId)) {
      return NextResponse.json({ error: 'Payer not in group' }, { status: 400 });
    }

    let processedSplits = [];

    if (splitType === 'equal') {
      const numParticipants = group.participants.length;
      const splitAmount = Math.round((amount / numParticipants) * 100) / 100; // Round to 2 decimals
      processedSplits = group.participants.map((p: any) => ({
        participant: p._id,
        amount: splitAmount,
      }));
    } else if (splitType === 'custom') {
      // Validate splits
      const totalSplit = splits.reduce((sum: number, s: any) => sum + (s.amount || 0), 0);
      if (Math.abs(totalSplit - amount) > 0.01) {
        return NextResponse.json({ error: 'Split amounts do not match total amount' }, { status: 400 });
      }
      processedSplits = splits.map((s: any) => ({
        participant: s.participantId,
        amount: s.amount,
      }));
    } else if (splitType === 'percentage') {
      // Validate percentages
      const totalPercentage = splits.reduce((sum: number, s: any) => sum + (s.percentage || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        return NextResponse.json({ error: 'Percentages do not add up to 100' }, { status: 400 });
      }
      processedSplits = splits.map((s: any) => ({
        participant: s.participantId,
        percentage: s.percentage,
        amount: Math.round((amount * s.percentage / 100) * 100) / 100,
      }));
    } else {
      return NextResponse.json({ error: 'Invalid split type' }, { status: 400 });
    }

    const expense = new Expense({
      description,
      amount,
      date: date || new Date(),
      payer: payerId,
      group: params.id,
      splitType,
      splits: processedSplits,
    });

    await expense.save();

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}