import { NextResponse } from "next/server";
import { z } from "zod";
import { chatMessageSchema } from "@shared/schema";
import {
  OPENROUTER_MODEL,
  extractAssistantMessage,
  getOpenRouterApiKey,
  toOpenRouterMessages,
} from "@/server/openrouter";

export async function POST(request: Request) {
  try {
    const validatedData = chatMessageSchema.parse(await request.json());
    const apiKey = getOpenRouterApiKey();

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error: API key not found",
        },
        { status: 500 },
      );
    }

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: toOpenRouterMessages(validatedData),
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error("OpenRouter API Error:", openRouterResponse.status, errorText);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to get response from AI assistant",
        },
        { status: 500 },
      );
    }

    const data = await openRouterResponse.json();
    const botMessage = extractAssistantMessage(data);

    if (!botMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from AI assistant",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: botMessage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    console.error("Chat endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process chat request",
      },
      { status: 500 },
    );
  }
}
