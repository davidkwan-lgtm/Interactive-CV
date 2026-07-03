import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  handleChat,
  handleCreateContactMessage,
  handleGetContactMessages,
} from "./api-handlers";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", handleCreateContactMessage);

  // Get contact messages (for admin purposes)
  app.get("/api/contact/messages", handleGetContactMessages);

  // Chat endpoint - proxies requests to OpenRouter securely
  app.post("/api/chat", handleChat);

  const httpServer = createServer(app);
  return httpServer;
}
