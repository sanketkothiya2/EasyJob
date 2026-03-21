import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

// GET - List all tasks with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const date = searchParams.get('date'); // For specific date filtering
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: session.user.id };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Filter by specific date
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // Filter by date range
    if (startDate && endDate) {
      query.dueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const tasks = await Task.find(query)
      .populate('linkedJobId', 'title company')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Transform data
    const transformedTasks = tasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
      userId: task.userId.toString(),
      linkedJobId: task.linkedJobId?._id?.toString() || null,
      linkedJob: task.linkedJobId ? {
        _id: task.linkedJobId._id.toString(),
        title: task.linkedJobId.title,
        company: task.linkedJobId.company,
      } : null,
    }));

    // Calculate stats
    const allTasks = await Task.find({ userId: session.user.id }).lean();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const stats = {
      total: allTasks.length,
      todo: allTasks.filter(t => t.status === 'todo').length,
      inProgress: allTasks.filter(t => t.status === 'in_progress').length,
      completed: allTasks.filter(t => t.status === 'done').length,
      daily: allTasks.filter(t => t.category === 'daily').length,
      weekly: allTasks.filter(t => t.category === 'weekly').length,
      monthly: allTasks.filter(t => t.category === 'monthly').length,
      overdue: allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length,
      today: allTasks.filter(t => t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) < tomorrow).length,
    };

    return NextResponse.json({ tasks: transformedTasks, stats });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const {
      title,
      description,
      category = 'daily',
      priority = 'medium',
      dueDate,
      scheduledTime,
      tags = [],
      subtasks = [],
      reminderAt,
      isRecurring = false,
      recurringPattern,
      linkedJobId,
      color,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    // Get the highest order number for this category
    const lastTask = await Task.findOne({ userId: session.user.id, category })
      .sort({ order: -1 })
      .lean();
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      userId: session.user.id,
      title,
      description,
      category,
      priority,
      status: 'todo',
      dueDate,
      scheduledTime,
      tags,
      subtasks,
      reminderAt,
      isRecurring,
      recurringPattern,
      linkedJobId,
      color,
      order,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('linkedJobId', 'title company')
      .lean();

    return NextResponse.json({
      task: {
        ...populatedTask,
        _id: populatedTask._id.toString(),
        userId: populatedTask.userId.toString(),
        linkedJobId: populatedTask.linkedJobId?._id?.toString() || null,
        linkedJob: populatedTask.linkedJobId ? {
          _id: populatedTask.linkedJobId._id.toString(),
          title: populatedTask.linkedJobId.title,
          company: populatedTask.linkedJobId.company,
        } : null,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
