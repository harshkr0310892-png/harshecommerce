import { GoogleGenAI, Type } from "@google/genai";
import { Product, AIReply } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate instruction with current inventory
const getSystemInstruction = (products: Product[]) => `
You are "Nex", an expert personal shopper for NexStore. 
You are friendly, concise, and helpful.
Your goal is to help customers find the best products from our catalog.
You have access to the following product catalog:
${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price, description: p.description })))}

When a user asks a question:
1. Analyze their needs.
2. Recommend products from the catalog that fit their needs.
3. Be persuasive but honest.
4. If the user asks about something we don't sell, politely redirect them to our available categories.

ALWAYS return your response in JSON format conforming to the specified schema.
`;

export const getGeminiResponse = async (userMessage: string, currentProducts: Product[]): Promise<AIReply> => {
  if (!apiKey) {
    return {
      message: "I'm sorry, my AI brain is currently offline (Missing API Key). Please try browsing the shop manually!",
      recommendedProductIds: []
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: getSystemInstruction(currentProducts),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: {
              type: Type.STRING,
              description: "The conversational response to the user."
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: "A list of product IDs that are recommended based on the user's query."
            }
          },
          required: ["message", "recommendedProductIds"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIReply;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      message: "I'm having a little trouble connecting to the product database right now. Please try again later.",
      recommendedProductIds: []
    };
  }
};
