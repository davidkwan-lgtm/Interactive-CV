import { NextResponse } from "next/server";
import { storage } from "@/server/storage";

export async function GET() {
  try {
    const messages = await storage.getContactMessages();
    return NextResponse.json(messages);
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve messages",
      },
      { status: 500 },
    );
  }
}
