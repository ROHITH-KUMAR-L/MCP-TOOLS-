import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        // Check if MongoDB is configured
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI || MONGODB_URI.includes('username:password')) {
            return NextResponse.json(
                {
                    error: 'Database not configured. Please set up MongoDB Atlas credentials in .env.local file. See the walkthrough documentation for setup instructions.'
                },
                { status: 503 }
            );
        }

        await connectDB();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists with this email' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            provider: 'credentials',
        });

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);

        // Check if it's a MongoDB connection error
        if (error.name === 'MongooseError' || error.message?.includes('connect')) {
            return NextResponse.json(
                { error: 'Database connection failed. Please check your MongoDB Atlas credentials in .env.local' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
