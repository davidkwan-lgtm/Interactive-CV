import test from "node:test";
import assert from "node:assert/strict";

import {
  CHATBOT_SYSTEM_PROMPT,
  OPENROUTER_MODEL,
  extractAssistantMessage,
  getOpenRouterApiKey,
  toOpenRouterMessages,
} from "./openrouter.ts";

test("toOpenRouterMessages includes the system prompt and conversation history", () => {
  const messages = toOpenRouterMessages({
    message: "Tell me about Alex's internship experience.",
    conversationHistory: [
      { role: "user", text: "Who is Alex?" },
      { role: "model", text: "Alex is a business graduate and marketer." },
    ],
  });

  assert.equal(messages[0]?.role, "system");
  assert.equal(messages[0]?.content, CHATBOT_SYSTEM_PROMPT);
  assert.deepEqual(messages.slice(1), [
    { role: "user", content: "Who is Alex?" },
    { role: "assistant", content: "Alex is a business graduate and marketer." },
    { role: "user", content: "Tell me about Alex's internship experience." },
  ]);
});

test("extractAssistantMessage reads the first text response from OpenRouter", () => {
  const message = extractAssistantMessage({
    model: OPENROUTER_MODEL,
    choices: [
      {
        message: {
          role: "assistant",
          content: "Alex increased social media engagement by 45% at Prudential Hong Kong.",
        },
      },
    ],
  });

  assert.equal(
    message,
    "Alex increased social media engagement by 45% at Prudential Hong Kong.",
  );
});

test("extractAssistantMessage returns null when the response has no assistant content", () => {
  const message = extractAssistantMessage({
    model: OPENROUTER_MODEL,
    choices: [{ message: { role: "assistant", content: null } }],
  });

  assert.equal(message, null);
});

test("getOpenRouterApiKey falls back to OPENROUTER_API_KEY_ALEX", () => {
  const apiKey = getOpenRouterApiKey({
    OPENROUTER_API_KEY_ALEX: "alex-key",
  });

  assert.equal(apiKey, "alex-key");
});
