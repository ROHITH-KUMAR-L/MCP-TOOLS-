import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { NextResponse } from 'next/server';

// GET specific conversation
export async function GET(request, context) {
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

        const { id } = await context.params;
        const conversation = await Conversation.findOne({ _id: id, userId: user._id });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
    }
}

// DELETE conversation
export async function DELETE(request, context) {
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

        const { id } = await context.params;
        console.log('Deleting conversation ID:', id);

        const conversation = await Conversation.findOneAndDelete({ _id: id, userId: user._id });

        if (!conversation) {
            console.log('Conversation not found for ID:', id, 'and user:', user._id);
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Also delete all messages in this conversation
        await Message.deleteMany({ conversationId: id });

        console.log('Conversation deleted successfully');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
    }
}

// PATCH update conversation title
export async function PATCH(request, context) {
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

        const { id } = await context.params;
        const { title } = await request.json();

        const conversation = await Conversation.findOneAndUpdate(
            { _id: id, userId: user._id },
            { title, updatedAt: Date.now() },
            { new: true }
        );

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Error updating conversation:', error);
        return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
    }
}
