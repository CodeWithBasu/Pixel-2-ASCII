import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AsciiArt from '@/models/AsciiArt';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { title, asciiData, settings, isColor } = body;

    if (!asciiData) {
      return NextResponse.json({ error: 'Missing ASCII data' }, { status: 400 });
    }

    const newArt = await AsciiArt.create({
      title: title || 'ASCII Studio Render',
      asciiText: JSON.stringify(asciiData),
      isColor,
      settings,
      author: 'Basudev_Studio_User'
    });

    return NextResponse.json({ success: true, id: newArt._id }, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const galleryItems = await AsciiArt.find({})
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ success: true, items: galleryItems }, { status: 200 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
