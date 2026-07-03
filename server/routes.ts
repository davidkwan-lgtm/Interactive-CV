import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, chatMessageSchema } from "@shared/schema";
import {
  OPENROUTER_MODEL,
  extractAssistantMessage,
  getOpenRouterApiKey,
  toOpenRouterMessages,
} from "./openrouter";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      // In a real application, you would send an email here using nodemailer
      // For now, we'll just store the message and return success
      
      res.json({ 
        success: true, 
        message: 'Thank you for your message! I will get back to you soon.',
        id: message.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid form data',
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send message. Please try again.' 
        });
      }
    }
  });

  // Get contact messages (for admin purposes)
  app.get('/api/contact/messages', async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to retrieve messages' 
      });
    }
  });

  // Chat endpoint - proxies requests to OpenRouter securely
  app.post('/api/chat', async (req, res) => {
    try {
      const validatedData = chatMessageSchema.parse(req.body);
      const apiKey = getOpenRouterApiKey();
      
      if (!apiKey) {
        return res.status(500).json({
          success: false,
          message: 'Server configuration error: API key not found'
        });
      }

      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: toOpenRouterMessages(validatedData),
        }),
      });

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        console.error('OpenRouter API Error:', openRouterResponse.status, errorText);
        return res.status(500).json({
          success: false,
          message: 'Failed to get response from AI assistant'
        });
      }

      const data = await openRouterResponse.json();
      const botMessage = extractAssistantMessage(data);

      if (!botMessage) {
        return res.status(500).json({
          success: false,
          message: 'Invalid response from AI assistant'
        });
      }

      res.json({
        success: true,
        message: botMessage
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
          errors: error.errors
        });
      } else {
        console.error('Chat endpoint error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to process chat request'
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
