import { Request, Response } from "express";
import redisClient from "../config/redis";
import FAQ, { IFAQ } from "../model/faqSchema";
import { translateText } from "../utils/translate";

const LANGUAGES = ["hi", "bn"];

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;

    const translations = await Promise.all(
      LANGUAGES.map(async (lang) => ({
        [`question_${lang}`]: await translateText(question, lang),
        [`answer_${lang}`]: await translateText(answer, lang),
      }))
    );

    const translationObject = Object.assign({}, ...translations);

    const newFAQ = new FAQ({ question, answer, ...translationObject });
    await newFAQ.save();

    res.status(201).json(newFAQ);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedFAQ = await FAQ.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedFAQ) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }

    await redisClient.del(`faq:${id}:hi`);
    await redisClient.del(`faq:${id}:bn`);
    await redisClient.del(`faq:${id}:en`);

    res.json(updatedFAQ);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFAQById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const lang = (req.query.lang as string) || "en";
    const cacheKey = `faq:${id}:${lang}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      res.json(JSON.parse(cachedData));
      return;
    }

    const faq = await FAQ.findById(id);
    if (!faq) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }

    const { question, answer } = faq.getTranslated(lang);

    const responseData = { _id: faq._id, question, answer };
    await redisClient.set(cacheKey, JSON.stringify(responseData), "EX", 3600);

    res.json(responseData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllFAQs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lang = (req.query.lang as string) || "en";
    const cacheKey = `faqs:${lang}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      res.json(JSON.parse(cachedData)); // ✅ Make sure to return void
      return;
    }

    const faqs = await FAQ.find().select(
      "question answer question_hi answer_hi question_bn answer_bn createdAt updatedAt"
    );

    const transformedFaqs = faqs.map((faq) => {
      const { question, answer } = faq.getTranslated(lang);
      return {
        _id: faq._id,
        question,
        answer,
      };
    });

    await redisClient.set(
      cacheKey,
      JSON.stringify(transformedFaqs),
      "EX",
      3600
    );
    res.json(transformedFaqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedFAQ = await FAQ.findByIdAndDelete(id);
    if (!deletedFAQ) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }

    await redisClient.del(`faq:${id}:hi`);
    await redisClient.del(`faq:${id}:bn`);
    await redisClient.del(`faq:${id}:en`);

    res.json({ message: "FAQ deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
