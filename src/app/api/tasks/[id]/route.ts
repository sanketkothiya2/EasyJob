import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

// GET - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const task = await Task.findOne({
      _id: params.id,
      userId: session.user.id,
    })
      .populate('linkedJobId', 'title company')
      .lean();

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({
      task: {
        ...task,
        _id: task._id.toString(),
        userId: task.userId.toString(),
        linkedJobId: task.linkedJobId?._id?.toString() || null,
        linkedJob: task.linkedJobId ? {
          _id: task.linkedJobId._id.toString(),
          title: task.linkedJobId.title,
          company: task.linkedJobId.company,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PUT - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    // Check if task exists and belongs to user
    const existingTask = await Task.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update allowed fields
    const allowedUpdates = [
      'title',
      'description',
      'category',
      'priority',
      'status',
      'dueDate',
      'scheduledTime',
      'tags',
      'subtasks',
      'reminderAt',
      'isRecurring',
      'recurringPattern',
      'linkedJobId',
      'color',
      'order',
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Handle completedAt based on status change
    if (updates.status === 'done' && existingTask.status !== 'done') {
      updates.completedAt = new Date();
    } else if (updates.status && updates.status !== 'done') {
      updates.completedAt = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('linkedJobId', 'title company')
      .lean();

    return NextResponse.json({
      task: {
        ...updatedTask,
        _id: updatedTask._id.toString(),
        userId: updatedTask.userId.toString(),
        linkedJobId: updatedTask.linkedJobId?._id?.toString() || null,
        linkedJob: updatedTask.linkedJobId ? {
          _id: updatedTask.linkedJobId._id.toString(),
          title: updatedTask.linkedJobId.title,
          company: updatedTask.linkedJobId.company,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const task = await Task.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
