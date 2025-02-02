import { v2 } from "@google-cloud/translate";

const translate = new v2.Translate({ key: process.env.GOOGLE_CLOUD_API_KEY });

export const translateText = async (
  text: string,
  targetLanguage: string
): Promise<string> => {
  if (!text) return "";

  try {
    const [translatedText] = await translate.translate(text, targetLanguage);
    return translatedText;
  } catch (error) {
    console.error(`Translation error: ${error}`);
    return text;
  }
};
