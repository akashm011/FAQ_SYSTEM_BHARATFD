import { Router } from "express";
import {
  createFAQ,
  updateFAQ,
  getFAQById,
  getAllFAQs,
  deleteFAQ,
} from "../controllers/faqController";

const router: Router = Router();
router.post("/", createFAQ);

router.put("/:id", updateFAQ);

// support ?lang=
router.get("/", getAllFAQs);

// support ?lang=
router.get("/:id", getFAQById);

router.delete("/:id", deleteFAQ);

export default router;
