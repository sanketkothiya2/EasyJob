import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Resource from '@/models/Resource';

// GET - Get single resource
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

    const resource = await Resource.findOne({
      _id: params.id,
      userId: session.user.id,
    }).populate('category', 'name color icon');

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({
      resource: {
        ...resource.toObject(),
        _id: resource._id.toString(),
        userId: resource.userId.toString(),
        category: resource.category?._id?.toString() || null,
        categoryData: resource.category ? {
          _id: resource.category._id.toString(),
          name: resource.category.name,
          color: resource.category.color,
          icon: resource.category.icon,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 });
  }
}

// PUT - Update resource
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
    const { title, content, url, thumbnail, description, siteName, category, tags, isFavorite } = body;

    const resource = await Resource.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(url !== undefined && { url }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(description !== undefined && { description }),
        ...(siteName !== undefined && { siteName }),
        ...(category !== undefined && { category: category || null }),
        ...(tags !== undefined && { tags }),
        ...(isFavorite !== undefined && { isFavorite }),
      },
      { new: true }
    ).populate('category', 'name color icon');

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({
      resource: {
        ...resource.toObject(),
        _id: resource._id.toString(),
        userId: resource.userId.toString(),
        category: resource.category?._id?.toString() || null,
        categoryData: resource.category ? {
          _id: resource.category._id.toString(),
          name: resource.category.name,
          color: resource.category.color,
          icon: resource.category.icon,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
  }
}

// DELETE - Delete resource
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

    const resource = await Resource.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 });
  }
}
