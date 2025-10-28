import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, chatMessageSchema } from "@shared/schema";
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

  // Chat endpoint - proxies requests to Gemini API securely
  app.post('/api/chat', async (req, res) => {
    try {
      const validatedData = chatMessageSchema.parse(req.body);
      const apiKey = process.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({
          success: false,
          message: 'Server configuration error: API key not found'
        });
      }

      // System prompt with Alex's information
      const SYSTEM_PROMPT = `You are Alex Chan's Interactive Resume - an AI assistant helping recruiters and potential employers learn about Alex's professional background. 

Alex Chan Profile:
- Recent Business Administration graduate from Lingnan University (Hong Kong)
- Major: Marketing | Minor: Business Analytics
- Expected graduation: May 2025

Experience:
1. Digital Marketing Intern at Prudential Hong Kong (Summer 2024)
   - Executed PRUHealth campaign, increasing social media engagement by 45%
   - Conducted market research, analyzing 1,000+ customer responses
   - Collaborated with design team on promotional materials

2. KPMG Case Competition Participant (Spring 2024)
   - Developed business strategy for sustainability challenge
   - Presented financial analysis and recommendations to KPMG partners
   - Demonstrated strategic thinking and teamwork

Skills:
Technical: Google Analytics, Excel, PowerPoint, Canva, Social Media Management
Business: Market Research, Data Analysis, Campaign Management, Strategic Planning
Soft Skills: Leadership, Communication, Team Collaboration, Problem-solving

Education:
- Lingnan University - Bachelor of Business Administration
- Major: Marketing, Minor: Business Analytics
- Expected Graduation: May 2025
- Relevant Coursework: Digital Marketing, Consumer Behavior, Business Analytics, Strategic Management

Guidelines:
- Answer questions about Alex's experience, skills, education, and qualifications
- Be professional, concise, and highlight relevant achievements
- If asked about something not in the profile, politely say you don't have that information
- Encourage recruiters to download the resume or contact Alex for more details
- Keep responses focused and recruiter-friendly (2-3 sentences typically)`;

      // Build conversation history
      const conversationHistory = validatedData.conversationHistory || [];
      const chatHistory = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: "Understood. I am Alex's Interactive Resume and will answer questions about his professional profile following those guidelines." }] },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        })),
        { role: 'user', parts: [{ text: validatedData.message }] }
      ];

      // Call Gemini API
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: chatHistory
        }),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API Error:', geminiResponse.status, errorText);
        return res.status(500).json({
          success: false,
          message: 'Failed to get response from AI assistant'
        });
      }

      const data = await geminiResponse.json();
      const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

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
