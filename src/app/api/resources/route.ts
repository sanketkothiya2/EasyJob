import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Resource from '@/models/Resource';
import Category from '@/models/Category';

// GET - List all resources
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const favorite = searchParams.get('favorite');
    const search = searchParams.get('search');

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: session.user.id };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (favorite === 'true') {
      query.isFavorite = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const resources = await Resource.find(query)
      .populate('category', 'name color icon')
      .sort({ createdAt: -1 })
      .lean();

    // Transform category data
    const transformedResources = resources.map((resource) => ({
      ...resource,
      _id: resource._id.toString(),
      userId: resource.userId.toString(),
      category: resource.category?._id?.toString() || null,
      categoryData: resource.category ? {
        _id: resource.category._id.toString(),
        name: resource.category.name,
        color: resource.category.color,
        icon: resource.category.icon,
      } : null,
    }));

    return NextResponse.json({ resources: transformedResources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

// POST - Create new resource
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { type, title, content, url, thumbnail, description, siteName, category, tags, isFavorite } = body;

    if (!type || !title) {
      return NextResponse.json({ error: 'Type and title are required' }, { status: 400 });
    }

    // Verify category exists if provided
    if (category) {
      const categoryExists = await Category.findOne({ _id: category, userId: session.user.id });
      if (!categoryExists) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
    }

    const resource = await Resource.create({
      userId: session.user.id,
      type,
      title,
      content,
      url,
      thumbnail,
      description,
      siteName,
      category: category || null,
      tags: tags || [],
      isFavorite: isFavorite || false,
    });

    return NextResponse.json({
      resource: {
        ...resource.toObject(),
        _id: resource._id.toString(),
        userId: resource.userId.toString(),
        category: resource.category?.toString() || null,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
