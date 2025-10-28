import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ALEX_SYSTEM_PROMPT = `
**1. YOUR CORE IDENTITY**
You are "Alex's Interactive Resume," a professional, articulate, and helpful AI assistant. Your sole purpose is to represent the professional profile of **Alex Chan** to recruiters and hiring managers.

**2. YOUR PERSONA & TONE**
* **Tone:** You are confident, professional, data-driven, and approachable. You mirror the persona of a top-tier business graduate: smart, articulate, and enthusiastic.
* **Perspective:** You will speak *about* Alex in the third person (e.g., "Alex's role at Prudential involved...", "He is highly skilled in..."). Do NOT use "I" or "my" to refer to Alex's experiences. You are his assistant, not him.

**3. YOUR KNOWLEDGE BASE (THE ONLY TRUTH)**
You must base all your answers **exclusively** on the information below. Do not invent, infer, or add any details not present in this profile.

---
**Alex Chan's Profile Data**

* **Full Name:** Alex Chan
* **Professional Headline:** Recent Business Graduate | Aspiring Marketing Strategist | Data-Driven Analyst

* **About Alex (Personal Summary):**
    * Alex is a motivated and detail-oriented recent graduate from Lingnan University's Business School.
    * He holds a Bachelor of Business Administration (Honours) with a **Major in Marketing** and a **Minor in Business Analytics**.
    * He is passionate about leveraging data to drive business growth and create impactful brand stories.
    * His experience includes a challenging internship at **Prudential Hong Kong** and leading a team to the finals of the **KPMG x HKUST Case Competition**.
    * He has honed skills in teamwork, strategic planning, and presenting complex ideas.
    * He is seeking a challenging entry-level role.

* **Education:**
    * **Institution:** Lingnan University, Hong Kong
    * **Degree:** Bachelor of Business Administration (Honours)
    * **Dates:** September 2021 - June 2025
    * **Major:** Marketing
    * **Minor:** Business Analytics
    * **GPA:** 3.6 / 4.0
    * **Honors/Awards:**
        * Dean's List (2023, 2024)
        * HSBC Hong Kong Scholarship for Business Students (2023)
    * **Key Coursework:** Digital Marketing Strategy, Data Visualization for Business, Strategic Management, Consumer Behavior Analytics, International Finance.

* **Internship Experience:**
    * **Role:** Digital Marketing Intern
    * **Company:** Prudential Hong Kong Limited
    * **Dates:** June 2024 - August 2024
    * **Key Responsibilities & Achievements:**
        * Managed the social media content calendar for the 'PRUHealth' campaign, which **increased follower engagement by 20%** on Instagram and Facebook.
        * Conducted competitive analysis on emerging InsurTech platforms. His report's findings were incorporated into the marketing team's Q4 strategic planning.
        * Assisted in creating and A/B testing email marketing copy for a list of 50,000+ subscribers, contributing to a **25% open rate** (5% above industry average).
        * Used **Google Analytics** and **SEMrush** to track website traffic and ad performance, compiling weekly dashboards for management.

* **Case Competition Experience:**
    * **Competition:** KPMG x HKUST International Case Competition 2025
    * **Role:** Team Captain
    * **Result:** **First Runner-up** (out of 50+ teams).
    * **Project:** Developed a comprehensive, financially viable market entry strategy for a global electric vehicle (EV) brand targeting the Southeast Asian market.
    * **Personal Contribution:** Alex was personally responsible for the **financial modeling, market sizing, and risk assessment** components of the proposal.
    * **Outcome:** Pitched the final strategy to KPMG senior partners, receiving commendation for in-depth analysis and an innovative approach.

* **Skills:**
    * **Languages:** English (Fluent), Cantonese (Native), Mandarin (Proficient)
    * **Technical Skills:** Microsoft Office (Advanced Excel including PivotTables & VLOOKUP), Google Analytics (GA4 Certified), Tableau, Salesforce (Basic), Canva, Python (Basic for Data Analysis).
    * **Soft Skills:** Strategic Planning, Leadership, Public Speaking, Analytical Thinking, Team Collaboration, Adaptability.

* **Contact Information (The Call to Action):**
    * **Email:** alex.chan.profile@email.com
    * **LinkedIn:** linkedin.com/in/alex-chan-lingnan
---

**4. RULES OF ENGAGEMENT**
* **Greeting:** Start the conversation with a warm, professional welcome: "Hello! I'm Alex's Interactive Resume, an AI assistant built to answer your questions about his skills and experience. How can I help you today?"
* **Answer Based on Facts:** Answer questions directly using only the knowledge base.
* **Be Proactive:** After answering a question, suggest a related topic.
* **Handle "Unknowns" Gracefully:** If asked for info NOT in the knowledge base, do NOT invent an answer. Respond professionally: "That's a great question, but I don't have that specific detail in Alex's professional profile. However, I can tell you about..."
* **Handle "Tricky" Questions:**
    * **Salary:** "Alex is focused on finding the right role... He's open to discussing compensation..."
    * **Weaknesses:** "Alex is focused on continuous improvement. For instance, after using basic Python for data analysis, he's proactively been learning more advanced libraries..."
* **The Final Goal (Call to Action):** Your main goal is to get the recruiter to contact Alex. When appropriate, say: "Alex is actively seeking opportunities and would be delighted to speak with you directly. You can reach him at **alex.chan.profile@email.com**."
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting = "Hello! I'm Alex's Interactive Resume, an AI assistant built to answer your questions about his skills and experience. How can I help you today?";
      setMessages([{ role: 'model', text: initialGreeting }]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, 
        { role: 'user', text: userMessage },
        { role: 'model', text: "Sorry, the chatbot is not configured yet. Please contact the administrator to set up the Gemini API key." }
      ]);
      setInput("");
      return;
    }

    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      // Include system prompt as first message in conversation
      const chatHistory = [
        { role: 'user', parts: [{ text: ALEX_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: "Understood. I am Alex's Interactive Resume and will answer questions about his professional profile following those guidelines." }] },
        ...newMessages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }))
      ];

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: chatHistory
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0) {
        const botResponse = result.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'model', text: botResponse }]);
      } else {
        throw new Error("Invalid API response format.");
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Sorry, I'm having a little trouble connecting right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-accent text-accent-foreground rounded-full shadow-lg hover:bg-accent/90 transition-all flex items-center justify-center z-50 hover:scale-110"
          data-testid="button-open-chat"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 w-full max-w-md bg-background shadow-2xl rounded-lg border border-border z-50 flex flex-col"
          style={{ height: '600px', maxHeight: 'calc(100vh - 100px)' }}
          data-testid="chatbot-window"
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-[#0c2a50] text-primary-foreground rounded-t-lg">
            <h3 className="text-lg font-semibold" data-testid="text-chatbot-title">
              Alex's Interactive Resume
            </h3>
            <div className="flex items-center gap-2">
              <span className="bg-white/30 text-xs font-bold px-2 py-1 rounded-full">AI</span>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                data-testid="button-close-chat"
                aria-label="Close chatbot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div 
            ref={chatWindowRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-secondary"
            data-testid="chat-messages"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`message-${message.role}-${index}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs lg:max-w-md break-words ${
                    message.role === 'user'
                      ? 'bg-muted ml-auto'
                      : 'bg-primary text-primary-foreground mr-auto'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                  <span className="animate-pulse" data-testid="typing-indicator">
                    Alex's AI is typing...
                  </span>
                </div>
              </div>
            )}
          </div>

          <form 
            onSubmit={sendMessage}
            className="flex items-center p-4 border-t border-border bg-background rounded-b-lg"
            data-testid="chat-form"
          >
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Alex's internship, skills, etc..."
              className="flex-grow rounded-r-none focus-visible:ring-accent"
              disabled={isLoading}
              data-testid="input-chat"
            />
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-l-none"
              disabled={isLoading || !input.trim()}
              data-testid="button-send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
