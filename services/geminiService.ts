import { GoogleGenAI, Type } from "@google/genai";
import { Story } from '../types';

export const translateStories = async (stories: Story[]): Promise<Story[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. Please ensure it is configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const model = 'gemini-2.5-flash';
    
    const prompt = `Translate the following stories from Spanish to Russian. Return the result as a valid JSON array where each object has a 'title' and 'content' key, corresponding to the translated title and content of each story. Maintain the original structure and paragraph breaks within the content. Here is the JSON array of stories to translate: ${JSON.stringify(stories)}`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                            },
                            content: {
                                type: Type.STRING,
                            },
                        },
                        required: ["title", "content"],
                    },
                },
            },
        });
        
        const jsonText = response.text?.trim();
        if (!jsonText) {
            throw new Error("Received an empty response from the API.");
        }
        
        const translatedData = JSON.parse(jsonText);
        
        if (Array.isArray(translatedData) && translatedData.every(item => typeof item.title === 'string' && typeof item.content === 'string')) {
             return translatedData as Story[];
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }
    } catch (error) {
        console.error("Error translating stories:", error);
        if (error instanceof SyntaxError) {
            throw new Error("Failed to parse the translation response. The API might have returned invalid JSON.");
        }
        throw new Error("Failed to translate stories. Please check the console for details.");
    }
};
