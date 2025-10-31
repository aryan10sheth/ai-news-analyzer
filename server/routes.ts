import type { Express } from "express";
import { createServer, type Server } from "http";
import { summarizeArticle, chatAboutArticle } from "./gemini";
import { summarizeRequestSchema, chatRequestSchema } from "@shared/schema";
import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = "https://newsapi.org/v2";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Fetch news articles
  app.get("/api/news", async (req, res) => {
    try {
      const query = (req.query.q as string) || "latest";
      const pageSize = 30;
      
      const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
        params: {
          q: query,
          pageSize,
          language: "en",
          sortBy: "publishedAt",
          apiKey: NEWS_API_KEY,
        },
      });

      if (response.data.status === "ok") {
        res.json(response.data.articles || []);
      } else {
        res.status(500).json({ error: "Failed to fetch news articles" });
      }
    } catch (error: any) {
      console.error("Error fetching news:", error.response?.data || error.message);
      res.status(500).json({ 
        error: "Failed to fetch news articles",
        details: error.response?.data?.message || error.message 
      });
    }
  });

  // Summarize article
  app.post("/api/summarize", async (req, res) => {
    try {
      const validatedData = summarizeRequestSchema.parse(req.body);
      
      const content = validatedData.content || validatedData.description || "";
      
      if (!content) {
        return res.status(400).json({ error: "Article has no content to summarize" });
      }

      const summary = await summarizeArticle(
        validatedData.title,
        content,
        validatedData.description
      );

      res.json(summary);
    } catch (error: any) {
      console.error("Error summarizing article:", error);
      
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          error: "Invalid request data",
          details: error.errors 
        });
      }

      res.status(500).json({ 
        error: "Failed to generate summary",
        details: error.message 
      });
    }
  });

  // Chat about article
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      
      const response = await chatAboutArticle(
        validatedData.articleContext,
        validatedData.message,
        validatedData.conversationHistory
      );

      res.json({ response });
    } catch (error: any) {
      console.error("Error in chat:", error);
      
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          error: "Invalid request data",
          details: error.errors 
        });
      }

      res.status(500).json({ 
        error: "Failed to get chat response",
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
