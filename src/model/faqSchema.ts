import mongoose, { model, Schema, Document } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  question_hi?: string;
  answer_hi?: string;
  question_bn?: string;
  answer_bn?: string;
  getTranslated(lang: string): { question: string; answer: string };
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    question_hi: { type: String },
    answer_hi: { type: String },
    question_bn: { type: String },
    answer_bn: { type: String },
  },
  { timestamps: true }
);

FAQSchema.methods.getTranslated = function (lang: string) {
  return {
    question: this[`question_${lang}`] || this.question,
    answer: this[`answer_${lang}`] || this.answer,
  };
};
const FAQ = model<IFAQ>("FAQ", FAQSchema);
export default FAQ;
