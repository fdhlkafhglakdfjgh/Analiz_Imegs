import { GoogleGenAI, Modality } from "@google/genai";

const getAiClient = () => {
  // This check is safe to run in a browser environment where `process` is not defined.
  const API_KEY = typeof process === 'object' && process.env ? process.env.API_KEY : undefined;

  if (!API_KEY) {
    throw new Error("API key is not configured. Please ensure the API_KEY environment variable is set.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

interface ImageEditParams {
  base64Image: string;
  mimeType: string;
  prompt: string;
}

export const editImage = async ({ base64Image, mimeType, prompt }: ImageEditParams): Promise<string> => {
  try {
    const ai = getAiClient(); // Throws an error if API_KEY is missing

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const resultMimeType = part.inlineData.mimeType;
        const resultBase64Data = part.inlineData.data;
        return `data:${resultMimeType};base64,${resultBase64Data}`;
      }
    }
    throw new Error("No image data found in the API response. The content may have been blocked.");

  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    // Propagate the error to be handled by the UI component
    if (error instanceof Error) {
        throw error; // Re-throw the original error (e.g., from getAiClient)
    }
    throw new Error("An unknown error occurred while editing the image.");
  }
};