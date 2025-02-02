import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import faqRoutes from "./routes/faqRoutes";
dotenv.config();
const app = express();

connectDB();

app.use(express.json());

app.use("/api/faqs", faqRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
