import "dotenv/config";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const sessionData = getSessionDataFromArgs();

function buildRecipe(sessionData) {
  let tone = "";
  let setting = "";
  let action = "";
  let avoid = "";
  let focus = "";

  if (sessionData.subject === "couple" && sessionData.mood === "emotional") {
    tone = "emotional, documentary, restrained";
    avoid = "cliché wedding phrases, exaggerated romance, overly poetic language";
    focus = "quiet moments, subtle connection";
  }

  if (sessionData.setting === "outdoor") {
    setting = "natural outdoor environment, open space, subtle atmosphere";
    focus += ", landscape, air, light, and sense of place";
  }

  if (sessionData.action === "standing") {
    action = "standing close together";
  }

  if (sessionData.action === "walking") {
    action = "walking side by side";
  }

  if (sessionData.action === "sitting") {
    action = "sitting close together";
  }

  return {
    tone,
    setting,
    action,
    avoid,
    focus
  };
}

function buildPrompt(recipe, sessionData) {
  let lengthInstruction = "";

  if (sessionData.length === "short") {
    lengthInstruction = "Write 1-2 very concise sentences.Keep the language simple and direct.Do not add extra interpretation.";
  }

  if (sessionData.length === "medium") {
    lengthInstruction = "Write 2-3 sentences.";
  }

  if (sessionData.length === "story") {
    lengthInstruction = "Write a slightly fuller caption in 3-4 sentences.";
  }

  return `
Write a wedding caption.

Tone: ${recipe.tone}
Setting: ${recipe.setting}
Action: ${recipe.action}
Avoid: ${recipe.avoid}
Focus on: ${recipe.focus}

${lengthInstruction}

Do not sound poetic, lyrical, or overly written.
Use simple, observant, human language.
Prefer concrete, observable details over abstract language.
Show, don't explain.
Avoid stating emotions directly.
Remove anything that feels decorative or unnecessary.
Avoid repeating common phrases. Use varied, natural language.
`;
}

function getSessionDataFromArgs() {
  const args = process.argv.slice(2);

  return {
    subject: args[0] || "couple",
    mood: args[1] || "emotional",
    setting: args[2] || "outdoor",
    action: args[3] || "walking",
    length: args[4] || "short"
  };
}

async function run() {
  const recipe = buildRecipe(sessionData);
  const finalPrompt = buildPrompt(recipe, sessionData);

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: finalPrompt,
  });

  const outputText = response.output[0].content[0].text;

  console.log("AI OUTPUT:", outputText);

  const { data, error } = await supabase
    .from("photographers")
    .insert([
      {
        input_text: JSON.stringify(sessionData),
        output_text: outputText,
      },
    ])
    .select();

  if (error) {
    console.error("DB ERROR:", error);
  } else {
    console.log("ZAPISANE DO DB:", data);
  }
}

run();