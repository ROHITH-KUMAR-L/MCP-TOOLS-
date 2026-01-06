import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import UserSettings from '@/models/UserSettings';
import { NextResponse } from 'next/server';

// GET user settings
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

        let settings = await UserSettings.findOne({ userId: user._id });

        if (!settings) {
            // Create default settings if none exist
            settings = await UserSettings.create({
                userId: user._id,
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// POST/UPDATE user settings
export async function POST(request) {
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

        const body = await request.json();
        const { huggingfaceToken, githubToken, googleDriveConnected, googleSheetsConnected } = body;

        let settings = await UserSettings.findOne({ userId: user._id });

        if (settings) {
            // Update existing settings
            settings.huggingfaceToken = huggingfaceToken || settings.huggingfaceToken;
            settings.githubToken = githubToken || settings.githubToken;
            settings.googleDriveConnected = googleDriveConnected !== undefined ? googleDriveConnected : settings.googleDriveConnected;
            settings.googleSheetsConnected = googleSheetsConnected !== undefined ? googleSheetsConnected : settings.googleSheetsConnected;
            await settings.save();
        } else {
            // Create new settings
            settings = await UserSettings.create({
                userId: user._id,
                huggingfaceToken: huggingfaceToken || '',
                githubToken: githubToken || '',
                googleDriveConnected: googleDriveConnected || false,
                googleSheetsConnected: googleSheetsConnected || false,
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
