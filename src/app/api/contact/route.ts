import { NextResponse } from "next/server";
import { z } from "zod";
import { insertContactMessageSchema } from "@shared/schema";
import { storage } from "@/server/storage";

export async function POST(request: Request) {
  try {
    const validatedData = insertContactMessageSchema.parse(await request.json());
    const message = await storage.createContactMessage(validatedData);

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! I will get back to you soon.",
      id: message.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid form data",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again.",
      },
      { status: 500 },
    );
  }
}
