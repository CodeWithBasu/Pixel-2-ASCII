import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Explicitly check for admin email from env
    const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = await createToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    });

    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return NextResponse.json({ 
      success: true, 
      user: { name: user.name, email: user.email, role: user.role } 
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
