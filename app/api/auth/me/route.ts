import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';

export async function GET() {
  const user = await getUser();
  
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 200 });
  }

  return NextResponse.json({ success: true, user });
}
