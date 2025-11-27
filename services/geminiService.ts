
import { GoogleGenAI, Type } from "@google/genai";
import { DailyContent, PosterTheme } from "../types";
import { THEME_PROMPTS } from "../constants";

// Initialize Gemini Client
// @ts-ignore
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the text content (quote, luck, etc.) for the calendar.
 */
export const generateDailyText = async (date: Date, theme: PosterTheme): Promise<DailyContent> => {
  const dateStr = date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Today is ${dateStr}. Generate content for a "Daily Inspiration Calendar" (灵感日历).
    Theme: ${theme}.
    
    Please provide:
    1. A short, inspiring quote or philosophical thought (in Chinese).
    2. The author of the quote (or "Unknown").
    3. A "lucky item" for the day.
    4. A "lucky color" for the day.
    5. A very short poem or haiku related to the date/season (optional).
    6. Accurate Lunar Date details for this specific date in Chinese (e.g., "乙巳年 丁亥月 十月初八"). Include GanZhi (Stems and Branches) for Year and Month if possible.
    7. The Solar Term (JieQi) for this period (e.g., "小雪", "大雪", "立春").
    8. "Yi" (宜): 2-3 short activities suitable for today (e.g., "阅读", "大扫除").
    9. "Ji" (忌): 2-3 short activities to avoid today (e.g., "熬夜", "争执").
    
    Return pure JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          quote: { type: Type.STRING, description: "Inspirational quote in Chinese" },
          author: { type: Type.STRING, description: "Author name" },
          luckyItem: { type: Type.STRING, description: "A lucky object" },
          luckyColor: { type: Type.STRING, description: "A lucky color" },
          poem: { type: Type.STRING, description: "Short poem or haiku" },
          lunarDate: { type: Type.STRING, description: "Full lunar date string with GanZhi, e.g. 乙巳年 丁亥月 十月初八" },
          solarTerm: { type: Type.STRING, description: "Solar term (JieQi)" },
          yi: { type: Type.STRING, description: "Suitable activities (Yi), separated by space or comma" },
          ji: { type: Type.STRING, description: "Avoid activities (Ji), separated by space or comma" }
        },
        required: ["quote", "author", "luckyItem", "luckyColor", "lunarDate", "solarTerm", "yi", "ji"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate text content");
  }

  return JSON.parse(response.text) as DailyContent;
};

/**
 * Generates the background image for the poster.
 */
export const generatePosterImage = async (content: DailyContent, theme: PosterTheme): Promise<string> => {
  const stylePrompt = THEME_PROMPTS[theme];
  
  // Construct a prompt that combines the generated text's mood with the chosen visual style.
  const imagePrompt = `
    A beautiful, artistic background image representing this concept: "${content.quote}".
    Style: ${stylePrompt}.
    No text, no words, no letters in the image. High quality, aesthetic, wallpaper, 1:1 aspect ratio.
  `;

  // Using gemini-2.5-flash-image for generation as per guidelines for general image tasks
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: imagePrompt }
      ]
    },
    config: {
      // Note: responseMimeType is not supported for image models usually, but we need raw output
      // We rely on the inlineData in the response.
    }
  });

  // Extract image from response
  // The response structure for image generation often returns the image in inlineData
  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    const parts = candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image generated.");
};
