export const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-v4-flash";
export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL;

export const CHATBOT_SYSTEM_PROMPT = `You are Alex Chan's Interactive Resume - an AI assistant helping recruiters and potential employers learn about Alex's professional background.

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

type OpenRouterRole = "system" | "user" | "assistant";

export interface OpenRouterMessage {
  role: OpenRouterRole;
  content: string;
}

export interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      role?: string;
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
}

export interface ChatConversationMessage {
  role: "user" | "model";
  text: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatConversationMessage[];
}

export function getOpenRouterApiKey(
  env: Record<string, string | undefined> = process.env,
) {
  return env.OPENROUTER_API_KEY ?? env.OPENROUTER_API_KEY_ALEX ?? null;
}

export function toOpenRouterMessages(input: ChatRequest): OpenRouterMessage[] {
  const history = input.conversationHistory ?? [];

  return [
    {
      role: "system",
      content: CHATBOT_SYSTEM_PROMPT,
    },
    ...history.map((message): OpenRouterMessage => ({
      role: message.role === "model" ? "assistant" : "user",
      content: message.text,
    })),
    {
      role: "user" satisfies OpenRouterRole,
      content: input.message,
    },
  ];
}

export function extractAssistantMessage(response: OpenRouterResponse) {
  const content = response.choices?.[0]?.message?.content;
  return typeof content === "string" && content.trim() ? content : null;
}

export function createFallbackChatMessage(input: ChatRequest) {
  const question = input.message.toLowerCase();

  if (question.includes("prudential") || question.includes("intern")) {
    return "At Prudential Hong Kong, Alex worked as a Digital Marketing Intern on the PRUHealth campaign, helped lift social media engagement by 45%, analyzed 1,000+ customer responses, and collaborated with designers on promotional materials.";
  }

  if (question.includes("skill") || question.includes("tool")) {
    return "Alex brings marketing and analytics skills including Google Analytics, Excel, PowerPoint, Canva, social media management, market research, data analysis, campaign management, and strategic planning.";
  }

  if (question.includes("education") || question.includes("university") || question.includes("degree")) {
    return "Alex studied Business Administration at Lingnan University, majoring in Marketing with a minor in Business Analytics and expected graduation in May 2025.";
  }

  if (question.includes("kpmg") || question.includes("competition")) {
    return "Alex participated in the KPMG Case Competition, developing a sustainability-focused business strategy and presenting financial analysis and recommendations to KPMG partners.";
  }

  return "Alex is a Lingnan University Business Administration graduate focused on marketing and business analytics, with experience in digital marketing at Prudential Hong Kong, case competition strategy work with KPMG, and strengths in analytics, campaign management, and communication.";
}
