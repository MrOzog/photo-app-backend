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
  process.env.SUPABASE_ANON_KEY,
);

app.post("/generate", async (req, res) => {
  try {
    const sessionData = req.body;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Missing imageUrl" });
    }

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
              image_url: imageUrl,
            },
          ],
        },
      ],
    });

    const visionText = visionResponse.output_text;
    console.log("VISION:", visionText);

    const signalsResponse = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
Convert the description below into a JSON object.

Return valid JSON only.
No markdown.
No explanation.

Use exactly this shape:
{
  "peopleCount": null,
  "subjectType": "",
  "action": "",
  "environment": "",
  "composition": "",
  "light": "",
  "mood": "",
  "interaction": "",
  "notableDetails": []
}

Rules:
- peopleCount = number of visible people, or 0 if none
- subjectType must be one of: "couple", "group", "single", "detail", "decor", "unknown"
- action must be simple and visual, e.g. "walking", "standing", "hugging", "talking", "looking", "static", "unknown"
- environment must be short and factual
- composition must be one of: "wide", "medium", "close", "detail", "unknown"
- light must be simple and visual, e.g. "soft", "harsh", "backlit", "overcast", "indoor warm", "natural daylight", "unknown"
- mood must be one of: "quiet", "joyful", "intimate", "formal", "playful", "romantic", "calm", "unknown"
- interaction must be one of: "touching", "close", "apart", "eye contact", "no contact", "none", "unknown"
- notableDetails must contain 0 to 5 short factual visual details
- if the image shows objects or scene details rather than people, use subjectType = "detail" or "decor"
- do not invent anything not clearly visible

Description:
${visionText}
`,
    });

    const rawSignals = signalsResponse.output_text;
    console.log("RAW IMAGE SIGNALS:", rawSignals);

    let parsedImageSignals = {};

    try {
      parsedImageSignals = JSON.parse(rawSignals);
    } catch (e) {
      console.error("IMAGE SIGNALS PARSE ERROR:", e);
      parsedImageSignals = {};
    }

    console.log("PARSED IMAGE SIGNALS:", parsedImageSignals);

    const recipe = buildRecipe(sessionData);
    const finalPrompt = buildPrompt(recipe, sessionData, parsedImageSignals);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: finalPrompt,
    });

    console.log("OPENAI RESPONSE RECEIVED");

    const outputText = response.output?.[0]?.content?.[0]?.text;
    console.log("OUTPUT TEXT:", outputText);

    console.log("SAVING TO DB:", sessionData);
    const { error } = await supabase.from("photographers").insert([
      {
        input_text: JSON.stringify(sessionData),
        output_text: outputText,
      },
    ]);

    if (error) {
      console.error("DB ERROR:", error);
    }

    console.log("SENDING RESPONSE TO FRONTEND");
    res.json({
      caption: outputText,
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
