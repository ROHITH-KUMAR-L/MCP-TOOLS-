import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === 'credentials';
        },
    },
    image: {
        type: String,
    },
    provider: {
        type: String,
        enum: ['credentials', 'google', 'github'],
        default: 'credentials',
    },
    emailVerified: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
