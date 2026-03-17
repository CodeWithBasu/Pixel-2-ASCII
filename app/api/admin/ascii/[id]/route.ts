import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AsciiArt from '@/models/AsciiArt';
import { getUser } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;
    
    await AsciiArt.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Transmission purged from vault.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
