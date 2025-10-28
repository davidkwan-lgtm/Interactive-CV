import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Call backend API endpoint instead of Gemini directly
      const conversationHistory = newMessages
        .filter(msg => msg.role !== 'model' || msg !== newMessages[newMessages.length - 1]) // Exclude initial greeting
        .filter((msg, idx) => idx !== newMessages.length - 1) // Exclude current message (will be sent separately)
        .map(msg => ({ role: msg.role, text: msg.text }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.length > 1 ? conversationHistory : undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.message) {
        setMessages(prev => [...prev, { role: 'model', text: result.message }]);
      } else {
        throw new Error("Invalid server response.");
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
