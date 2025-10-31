import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function summarizeArticle(title: string, content: string, description?: string): Promise<{
  summary: string;
  keyPoints: string[];
  readingTime: number;
}> {
  try {
    const articleText = `Title: ${title}\n\n${description ? `Description: ${description}\n\n` : ''}Content: ${content}`;
    
    const prompt = `You are a professional news analyst. Analyze the following news article and provide:
1. A concise summary (2-3 sentences) that captures the main story
2. 3-5 key points as bullet points highlighting the most important facts

Article:
${articleText}

Respond in JSON format:
{
  "summary": "your concise summary here",
  "keyPoints": ["point 1", "point 2", "point 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            keyPoints: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["summary", "keyPoints"]
        }
      }
    });

    const result = JSON.parse(response.text);
    
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      summary: result.summary || "Summary not available",
      keyPoints: result.keyPoints || [],
      readingTime
    };
  } catch (error) {
    console.error("Error summarizing article:", error);
    throw new Error("Failed to generate article summary");
  }
}

export async function chatAboutArticle(
  articleContext: string,
  userMessage: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful AI assistant that answers questions about news articles. 
You have access to the following article:

${articleContext}

Provide accurate, concise, and helpful answers based on the article content. If the question is not related to the article, politely guide the conversation back to the article topic.`;

    const contents = [
      systemPrompt,
      ...(conversationHistory || []).map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ),
      `User: ${userMessage}`
    ].join('\n\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error("Failed to get chat response");
  }
}
