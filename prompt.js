export function buildPrompt(recipe, sessionData) {
  let lengthInstruction = "";

  if (sessionData.length === "short") {
    lengthInstruction = "Write 1-2 very concise sentences. Keep it simple and direct.";
  }

  if (sessionData.length === "medium") {
    lengthInstruction = "Write 2-3 sentences.";
  }

  if (sessionData.length === "story") {
    lengthInstruction = "Write 3-4 sentences.";
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
Show, don't explain.
Avoid stating emotions directly.
Avoid repeating common phrases.
`;
}