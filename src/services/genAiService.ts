import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// One-time init with secure API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY ?? '');

// Memoized model cache
const modelCache = new Map<string, GenerativeModel>();

export const getModel = (modelName: string = 'gemma-3n-e4b-it'): GenerativeModel => {
  if (!modelCache.has(modelName)) {
    modelCache.set(modelName, genAI.getGenerativeModel({ model: modelName }));
  }
  return modelCache.get(modelName)!;
};

/**
 * Generates text from a prompt using the generative model.
 */
export const generateText = async (prompt: string, modelName?: string): Promise<string> => {
  const model = getModel(modelName);
  const result = await model.generateContent(prompt);
  return result.response.text();
};
