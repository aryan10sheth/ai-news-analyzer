import { z } from "zod";

// News Article from News API
export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// AI Summary Response
export interface ArticleSummary {
  summary: string;
  keyPoints: string[];
  readingTime: number;
}

// Chat Message
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// API Request/Response schemas
export const summarizeRequestSchema = z.object({
  title: z.string(),
  content: z.string(),
  description: z.string().optional(),
});

export const chatRequestSchema = z.object({
  articleContext: z.string(),
  message: z.string(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).optional(),
});

export type SummarizeRequest = z.infer<typeof summarizeRequestSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
