import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        default: 'New Conversation',
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
});

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
