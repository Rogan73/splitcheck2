
import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptItem } from "../types";

export const processReceiptImage = async (base64Image: string): Promise<ReceiptItem[]> => {
  const ai = new GoogleGenAI({ apiKey:   import.meta.env.VITE_API_KEY });  //  process.env.API_KEY  or import.meta.env.VITE_API_KEY
  
  const prompt = "Проаналізуй цей чек. Витягни всі позиції товарів, їх кількість та ціну за одиницю. Назви товарів залишай мовою оригіналу, як вони написані в чеку (не перекладай їх). Ігноруй податки та знижки, якщо вони вказані окремими рядками, тільки основні товари. Поверни результат у форматі JSON.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Назва товару мовою оригіналу" },
              quantity: { type: Type.NUMBER, description: "Кількість" },
              price: { type: Type.NUMBER, description: "Ціна за одиницю" },
            },
            required: ["name", "quantity", "price"],
          },
        },
      },
    });

    const jsonText = response.text || "[]";
    const items = JSON.parse(jsonText);
    
    return items.map((item: any, index: number) => ({
      ...item,
      id: `item-${index}-${Date.now()}`
    }));
  } catch (error) {
    console.error("Error processing receipt:", error);
    throw new Error("Не вдалося розпізнати чек. Спробуйте зробити більш чітке фото.");
  }
};
