import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    attachments: [{
        name: String,
        mimeType: String,  // Renamed from 'type' to avoid Mongoose keyword conflict
        data: String, // Base64 data
    }],
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
