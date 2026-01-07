import connectDB from '@/lib/db';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const notes = await Note.find().sort({ createdAt: -1 });
  return NextResponse.json(notes);
}

export async function POST(req) {
  const { title, content } = await req.json();
  await connectDB();
  const newNote = await Note.create({ title, content });
  return NextResponse.json(newNote);
}