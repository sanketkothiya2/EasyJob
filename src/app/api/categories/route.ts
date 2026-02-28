import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

// GET - List all categories
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const categories = await Category.find({ userId: session.user.id })
      .sort({ name: 1 })
      .lean();

    const transformedCategories = categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
      userId: cat.userId.toString(),
    }));

    return NextResponse.json({ categories: transformedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { name, color, icon } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check for duplicate
    const existing = await Category.findOne({ userId: session.user.id, name });
    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    const category = await Category.create({
      userId: session.user.id,
      name,
      color: color || '#ec4899',
      icon: icon || 'folder',
    });

    return NextResponse.json({
      category: {
        ...category.toObject(),
        _id: category._id.toString(),
        userId: category.userId.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
