import { expect } from "chai";
import request from "supertest";
import app from "../index";
import FAQ from "../model/faqSchema";

describe("FAQs API", () => {
  before(async () => {
    await FAQ.deleteMany({});
  });

  describe("POST /api/faqs", () => {
    it("should create a new FAQ", (done) => {
      request(app)
        .post("/api/faqs")
        .send({
          question: "What is TypeScript?",
          answer: "A superset of JavaScript.",
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("question", "What is TypeScript?");
          done();
        });
    });
  });

  describe("GET /api/faqs", () => {
    it("should fetch all FAQs", (done) => {
      request(app)
        .get("/api/faqs")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });
});
