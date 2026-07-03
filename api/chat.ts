import { z } from "zod";
import {
  OPENROUTER_MODEL,
  extractAssistantMessage,
  getOpenRouterApiKey,
  toOpenRouterMessages,
} from "../server/openrouter.js";

const chatMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string(),
      }),
    )
    .optional(),
});

export default async function handler(req: any, res: any) {
  try {
    const validatedData = chatMessageSchema.parse(req.body);
    const apiKey = getOpenRouterApiKey();

    if (!apiKey) {
      res.status(500).json({
        success: false,
        message: "Server configuration error: API key not found",
      });
      return;
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
      res.status(500).json({
        success: false,
        message: "Failed to get response from AI assistant",
      });
      return;
    }

    const data = await openRouterResponse.json();
    const botMessage = extractAssistantMessage(data);

    if (!botMessage) {
      res.status(500).json({
        success: false,
        message: "Invalid response from AI assistant",
      });
      return;
    }

    res.json({
      success: true,
      message: botMessage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: error.errors,
      });
      return;
    }

    console.error("Chat endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process chat request",
    });
  }
}
