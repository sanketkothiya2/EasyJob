import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import Job from '@/models/Job';

// GET /api/jobs/[id]/contacts - Get all contacts for a job
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

    const contacts = await Contact.find({ jobId: params.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST /api/jobs/[id]/contacts - Create a new contact
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
    const { name, role, email, linkedin, notes } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Contact name is required' },
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

    const contact = await Contact.create({
      jobId: params.id,
      userId: session.user.id,
      name,
      role,
      email,
      linkedin,
      notes,
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
