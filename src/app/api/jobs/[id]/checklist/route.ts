import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Checklist from '@/models/Checklist';
import Job from '@/models/Job';

// Default checklist items for new jobs
const defaultChecklistItems = [
  { id: '1', label: 'Research the company', completed: false },
  { id: '2', label: 'Tailor resume for this role', completed: false },
  { id: '3', label: 'Write cover letter', completed: false },
  { id: '4', label: 'Submit application', completed: false },
  { id: '5', label: 'Send follow-up email', completed: false },
  { id: '6', label: 'Prepare for interview', completed: false },
  { id: '7', label: 'Send thank you note', completed: false },
];

// GET /api/jobs/[id]/checklist - Get checklist for a job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Verify job belongs to user
    const job = await Job.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Find or create checklist for this job
    let checklist = await Checklist.findOne({ jobId: params.id });

    if (!checklist) {
      // Create default checklist for this job
      checklist = await Checklist.create({
        jobId: params.id,
        userId: session.user.id,
        items: defaultChecklistItems,
      });
    }

    return NextResponse.json({ checklist });
  } catch (error) {
    console.error('Error fetching checklist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch checklist' },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/[id]/checklist - Update checklist items
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify job belongs to user
    const job = await Job.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const checklist = await Checklist.findOneAndUpdate(
      { jobId: params.id },
      { items },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ checklist });
  } catch (error) {
    console.error('Error updating checklist:', error);
    return NextResponse.json(
      { error: 'Failed to update checklist' },
      { status: 500 }
    );
  }
}

// POST /api/jobs/[id]/checklist - Add a new checklist item
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { label } = body;

    if (!label || typeof label !== 'string') {
      return NextResponse.json(
        { error: 'Label is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify job belongs to user
    const job = await Job.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const newItem = {
      id: Date.now().toString(),
      label: label.trim(),
      completed: false,
    };

    const checklist = await Checklist.findOneAndUpdate(
      { jobId: params.id },
      { 
        $push: { items: newItem },
        $setOnInsert: { userId: session.user.id }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ checklist, newItem }, { status: 201 });
  } catch (error) {
    console.error('Error adding checklist item:', error);
    return NextResponse.json(
      { error: 'Failed to add checklist item' },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/[id]/checklist - Toggle a checklist item
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, completed } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify job belongs to user
    const job = await Job.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      'items.$.completed': completed,
    };

    if (completed) {
      updateData['items.$.completedAt'] = new Date();
    } else {
      updateData['items.$.completedAt'] = null;
    }

    const checklist = await Checklist.findOneAndUpdate(
      { jobId: params.id, 'items.id': itemId },
      { $set: updateData },
      { new: true }
    );

    if (!checklist) {
      return NextResponse.json(
        { error: 'Checklist item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ checklist });
  } catch (error) {
    console.error('Error toggling checklist item:', error);
    return NextResponse.json(
      { error: 'Failed to toggle checklist item' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id]/checklist - Delete a checklist item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify job belongs to user
    const job = await Job.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const checklist = await Checklist.findOneAndUpdate(
      { jobId: params.id },
      { $pull: { items: { id: itemId } } },
      { new: true }
    );

    return NextResponse.json({ checklist });
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    return NextResponse.json(
      { error: 'Failed to delete checklist item' },
      { status: 500 }
    );
  }
}
