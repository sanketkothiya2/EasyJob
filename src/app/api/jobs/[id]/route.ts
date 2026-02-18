import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';

// GET /api/jobs/[id] - Get a single job
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

    const job = await Job.findOne({
      _id: params.id,
      userId: session.user.id,
    }).lean();

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/[id] - Update a job
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

    await dbConnect();

    // Check if job exists and belongs to user
    const existingJob = await Job.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // If status is changing to 'applied', set dateApplied
    if (body.status === 'applied' && existingJob.status !== 'applied') {
      body.dateApplied = new Date();
    }

    // Update the job
    const job = await Job.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Archive a job
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

    await dbConnect();

    // Soft delete by setting archivedAt
    const job = await Job.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $set: { archivedAt: new Date() } },
      { new: true }
    );

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Job archived successfully' });
  } catch (error) {
    console.error('Error archiving job:', error);
    return NextResponse.json(
      { error: 'Failed to archive job' },
      { status: 500 }
    );
  }
}
