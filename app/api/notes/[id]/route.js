import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";


export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, content } = await request.json();
    await dbConnect();
    
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true } 
    );
    
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    
    await Note.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}