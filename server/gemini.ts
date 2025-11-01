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

    const result = JSON.parse(response.text ?? '{}');
    
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
    const systemPrompt = `You are a helpful, patient AI assistant specialized in explaining news articles to readers of all backgrounds.
You have access to the following article (use this as your ONLY source for factual claims):

${articleContext}

Behavior instructions:
- Answer questions accurately and concisely based on the article content.
- When the user asks about terminology, technical concepts, or industry jargon, first give a simple plain-language explanation (one or two sentences) suitable for someone without background knowledge.
- After the simple explanation, provide a short everyday example or analogy to illustrate the term.
- If the user wants more depth, offer an optional "Deeper explanation" section that goes into technical detail.
- If the user's question is ambiguous, ask a clarifying question before assuming details.
- If the user's question cannot be answered from the article, say so and (briefly) offer related background knowledge while clearly marking it as outside the article's scope.
- Keep answers friendly, avoid unnecessary jargon, and prefer short paragraphs and bullet lists when appropriate.

Now answer the user's latest question.
`;

    const conversationText = [
      systemPrompt,
      ...(conversationHistory || []).map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ),
      `User: ${userMessage}`
    ].join('\n\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationText,
      config: {
        temperature: 0.2,
        maxOutputTokens: 800,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error("Failed to get chat response");
  }
}
