import mongoose from 'mongoose';

const UserSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    huggingfaceToken: {
        type: String,
        default: '',
    },
    githubToken: {
        type: String,
        default: '',
    },
    googleDriveConnected: {
        type: Boolean,
        default: false,
    },
    googleSheetsConnected: {
        type: Boolean,
        default: false,
    },
    googleDriveRefreshToken: {
        type: String,
        default: '',
    },
    googleSheetsRefreshToken: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

export default mongoose.models.UserSettings || mongoose.model('UserSettings', UserSettingsSchema);
