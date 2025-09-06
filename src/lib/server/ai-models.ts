import { ChatGroq } from "@langchain/groq";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// Lazy-loaded models to avoid initialization during build time
let _groqModel: ChatGroq | null = null;
let _geminiEmbeddings: GoogleGenerativeAIEmbeddings | null = null;

export const getGroqModel = () => {
  if (!_groqModel) {
    // Dynamic import to avoid build-time initialization
    const { env } = require("@/env");
    _groqModel = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      apiKey: env.GROQ_API_KEY,
    });
  }
  return _groqModel;
};

// Getter for backward compatibility - will be lazy loaded when accessed
export const groqModel = {
  get model() {
    return getGroqModel();
  },
  // Proxy common methods
  withStructuredOutput: (...args: any[]) => getGroqModel().withStructuredOutput(...args),
  invoke: (...args: any[]) => getGroqModel().invoke(...args),
  stream: (...args: any[]) => getGroqModel().stream(...args),
};

export const getGeminiEmbeddings = () => {
  if (!_geminiEmbeddings) {
    // Dynamic import to avoid build-time initialization
    const { env } = require("@/env");
    _geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004", // Gemini's latest embedding model
      apiKey: env.GEMINI_API_KEY,
    });
  }
  return _geminiEmbeddings;
};
