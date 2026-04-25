import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Group from '@/models/Group';
import Participant from '@/models/Participant';
import { getUserFromToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    const params = await context.params;
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, color } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await dbConnect();

    // Check if group exists and belongs to user
    const group = await Group.findOne({ _id: params.id, owner: user._id });
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Check if participant with same name exists in group
    const existingParticipant = await Participant.findOne({
      name,
      _id: { $in: group.participants }
    });
    if (existingParticipant) {
      return NextResponse.json({ error: 'Participant with this name already exists in the group' }, { status: 400 });
    }

    const participant = new Participant({
      name,
      email,
      color: color || '#000000',
    });

    await participant.save();

    group.participants.push(participant._id);
    await group.save();

    return NextResponse.json(participant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}