import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';

// GET /api/jobs - Get all jobs for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    const query: Record<string, unknown> = { 
      userId: session.user.id,
      archivedAt: { $exists: false },
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      company, 
      location, 
      url, 
      description, 
      salary,
      excitement,
      deadline,
      platform,
      resumeImage,
      resumeImagePublicId,
    } = body;

    // Validate required fields
    if (!title || !company || !location) {
      return NextResponse.json(
        { error: 'Title, company, and location are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const job = await Job.create({
      userId: session.user.id,
      title,
      company,
      location,
      url,
      description,
      salary,
      status: 'bookmarked',
      excitement: excitement || 3,
      deadline: deadline || undefined,
      platform: platform || 'linkedin',
      resumeImage: resumeImage || undefined,
      resumeImagePublicId: resumeImagePublicId || undefined,
      dateSaved: new Date(),
      checklistProgress: {
        bookmarked: 0,
        applying: 0,
        applied: 0,
        interviewing: 0,
        negotiating: 0,
        accepted: 0,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
