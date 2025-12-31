
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMatchStrategy = async (map: string, mode: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert Free Fire esports coach. Provide 3 short, punchy, professional pro-tips for a tournament match on map: ${map} in ${mode} mode. Focus on drop locations, rotation strategies, and late-game survival. Format as bullet points.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Strategy Error:", error);
    return "• Focus on high-ground advantage.\n• Coordinate rotations with your team.\n• Keep utility items like Gloo Walls ready.";
  }
};

export const verifyPaymentScreenshot = async (base64Image: string, amount: number) => {
  const ai = getAI();
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image.split(',')[1] || base64Image,
      },
    };
    const textPart = {
      text: `Analyze this UPI payment screenshot. Verify if it shows a successful transaction of exactly ₹${amount}. Return a JSON object with "is_valid" (boolean) and "message" (string explanation). If it's not a payment screenshot, say so.`
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
    });

    const result = response.text || "";
    // Simple heuristic to extract JSON from markdown if present
    const jsonMatch = result.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { is_valid: true, message: "Manual verification required by admin." };
  } catch (error) {
    console.error("AI Verification Error:", error);
    return { is_valid: true, message: "AI verification service busy. Please proceed with manual verification." };
  }
};
