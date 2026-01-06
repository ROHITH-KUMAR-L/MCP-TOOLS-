import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { NextResponse } from 'next/server';

// GET all messages for a conversation
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

        // Verify conversation belongs to user
        const conversation = await Conversation.findOne({ _id: id, userId: user._id });
        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        const messages = await Message.find({ conversationId: id })
            .sort({ createdAt: 1 })
            .lean();

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

// POST send a new message and get AI response
export async function POST(request, context) {
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
        const { content, attachments } = await request.json();

        console.log('[API] Received attachments:', attachments?.length || 0, 'files');

        if ((!content || content.trim() === '') && (!attachments || attachments.length === 0)) {
            return NextResponse.json({ error: 'Message content or attachments are required' }, { status: 400 });
        }

        // Verify conversation belongs to user
        const conversation = await Conversation.findOne({ _id: id, userId: user._id });
        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Save user message WITHOUT attachments to avoid MongoDB schema issues
        // Attachments will only be sent to n8n, not stored in DB
        const userMessage = await Message.create({
            conversationId: id,
            role: 'user',
            content: content?.trim() || 'File attachment',
            attachments: [], // Don't store attachments in MongoDB
        });

        console.log('[API] Saved message to DB (without attachments)');

        // Get conversation history for context
        const previousMessages = await Message.find({ conversationId: id })
            .sort({ createdAt: 1 })
            .limit(10)
            .lean();

        // Call n8n webhook for AI response
        let aiResponseContent;

        try {
            const webhookUrl = process.env.N8N_WEBHOOK_URL;

            if (!webhookUrl) {
                throw new Error('N8N_WEBHOOK_URL not configured in environment variables');
            }

            // Prepare a "Universal" payload for n8n to ensure compatibility with all node versions/configs
            // We include fields at both the top level AND inside a 'body' object to match the user's expressions
            const payloadData = {
                conversationId: id,
                userMessage: content?.trim() || '',
                conversationHistory: previousMessages.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                    attachments: msg.attachments || [],
                })),
            };

            // Only add files array if attachments exist and are not empty
            if (attachments && attachments.length > 0) {
                payloadData.files = attachments.map(file => ({
                    fileName: file.name,
                    mimeType: file.mimeType,
                    data: file.data // Base64 data
                }));
            }

            const webhookPayload = {
                ...payloadData,
                // Nested body object specifically for the user's expression: $('Webhook').item.json.body.userMessage
                body: {
                    ...payloadData
                }
            };

            console.log(`[Webhook] Sending universal payload with ${attachments.length} files to n8n`);

            const webhookResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookPayload),
            });

            if (!webhookResponse.ok) {
                throw new Error(`Webhook returned ${webhookResponse.status}: ${webhookResponse.statusText}`);
            }

            const webhookText = await webhookResponse.text();
            let webhookData;

            try {
                webhookData = JSON.parse(webhookText);
                console.log('Webhook JSON response:', webhookData);

                // Extract AI response from webhook response
                aiResponseContent = webhookData.response || webhookData.message || webhookData.content ||
                    JSON.stringify(webhookData);
            } catch (e) {
                console.log('Webhook plain text response:', webhookText);
                // If not JSON, use the raw text as the AI response
                aiResponseContent = webhookText || 'Empty response from AI assistant.';
            }

        } catch (error) {
            console.error('Error calling n8n webhook:', error);
            aiResponseContent = `Sorry, I encountered an error: ${error.message}. Please check your n8n webhook configuration.`;
        }

        // Save AI response
        const aiMessage = await Message.create({
            conversationId: id,
            role: 'assistant',
            content: aiResponseContent,
        });

        // Update conversation's updatedAt timestamp
        conversation.updatedAt = Date.now();

        // Auto-generate title from first message if still default
        if (conversation.title === 'New Conversation' && previousMessages.length === 0) {
            const safeContent = content?.trim() || 'File attachment';
            const words = safeContent.split(' ').slice(0, 5).join(' ');
            conversation.title = words.length > 40 ? words.substring(0, 40) + '...' : words;
        }

        await conversation.save();

        return NextResponse.json({
            userMessage,
            aiMessage,
            conversation,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
