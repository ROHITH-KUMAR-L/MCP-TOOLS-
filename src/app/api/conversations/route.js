import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import { NextResponse } from 'next/server';

// GET all conversations for the authenticated user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const User = (await import('@/models/User')).default;
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const conversations = await Conversation.find({ userId: user._id })
            .sort({ updatedAt: -1 })
            .lean();

        return NextResponse.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }
}

// POST create a new conversation
export async function POST(request) {
    try {
        console.log('POST /api/conversations - Starting...');

        const session = await getServerSession(authOptions);
        console.log('Session:', session ? 'Found' : 'Not found');

        if (!session?.user?.email) {
            console.log('Unauthorized: No session or email');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Connecting to database...');
        await dbConnect();
        console.log('Database connected');

        console.log('Loading User model...');
        const User = (await import('@/models/User')).default;
        console.log('Finding user:', session.user.email);
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            console.log('User not found:', session.user.email);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log('User found:', user._id);

        const body = await request.json();
        console.log('Request body:', body);
        const { title } = body;

        console.log('Creating conversation...');
        const conversation = await Conversation.create({
            userId: user._id,
            title: title || 'New Conversation',
        });

        console.log('Conversation created:', conversation._id);
        return NextResponse.json(conversation, { status: 201 });
    } catch (error) {
        console.error('Error creating conversation:', error);
        console.error('Error stack:', error.stack);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        return NextResponse.json({
            error: 'Failed to create conversation',
            details: error.message,
            name: error.name
        }, { status: 500 });
    }
}
