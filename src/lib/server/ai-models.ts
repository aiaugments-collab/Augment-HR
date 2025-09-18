import { env } from "@/env";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  apiKey: env.GEMINI_API_KEY,
});

export const getGeminiEmbeddings = () =>
  new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004", // Gemini's latest embedding model
    apiKey: env.GEMINI_API_KEY,
  });
