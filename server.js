import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import cors from "cors";
import { buildRecipe } from "./recipe.js";
import { buildPrompt } from "./prompt.js";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 🚀 API

app.post("/generate", async (req, res) => {
  try {
    const sessionData = req.body;

    const recipe = buildRecipe(sessionData);
    const finalPrompt = buildPrompt(
      recipe,
      sessionData,
      sessionData.imageSignals
    );

    const visionResponse = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Describe this image in simple, factual terms.",
            },
            {
              type: "input_image",
              image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
            },
          ],
        },
      ],
    });

console.log("VISION:", visionResponse.output_text);
    console.log("OPENAI RESPONSE RECEIVED");

    const outputText = response.output?.[0]?.content?.[0]?.text;

    console.log("OUTPUT TEXT:", outputText);

    console.log("SAVING TO DB:", sessionData);
    const { data, error } = await supabase
    .from("photographers")
    .insert([
        {
        input_text: JSON.stringify(sessionData),
        output_text: outputText,
        },
    ]);

    if (error) {
    console.error("DB ERROR:", error);
    }

// 🔹 odpowiedź do frontendu
console.log("SENDING RESPONSE TO FRONTEND");
res.json({
  caption: outputText
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});