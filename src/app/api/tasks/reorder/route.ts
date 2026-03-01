import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

// POST - Bulk update task orders
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { tasks } = body; // Array of { _id, order, status }

    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: 'Tasks array is required' }, { status: 400 });
    }

    // Bulk update tasks
    const bulkOps = tasks.map((task: { _id: string; order: number; status?: string }) => ({
      updateOne: {
        filter: { _id: task._id, userId: session.user.id },
        update: { 
          $set: { 
            order: task.order,
            ...(task.status && { status: task.status }),
            ...(task.status === 'done' && { completedAt: new Date() }),
            ...(task.status && task.status !== 'done' && { completedAt: null }),
          } 
        },
      },
    }));

    await Task.bulkWrite(bulkOps);

    return NextResponse.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
}
