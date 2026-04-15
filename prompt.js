const styleBlock = `
You are a documentary wedding photographer.

Write like a human observer, not a marketer.

Rules:
- No clichés (no "beautiful", "magical", "special day")
- No sales language
- No hashtags
- No emojis
- No over-explaining
- No generic storytelling

Style:
- Observational
- Subtle
- Emotion through detail, not adjectives
- Short to medium sentences
- Slight imperfection is OK

Focus on:
- small moments
- body language
- atmosphere
- what is NOT obvious

Avoid:
- describing the photo literally
- explaining emotions directly
`;

export function buildPrompt(recipe, sessionData) {
  let lengthInstruction = "";

  if (sessionData.length === "short") {
    lengthInstruction =
      "Write 1-2 very concise sentences. Keep it simple and direct.";
  }

  if (sessionData.length === "medium") {
    lengthInstruction = "Write 2-3 sentences.";
  }

  if (sessionData.length === "story") {
    lengthInstruction = "Write 3-4 sentences.";
  }

  return `
    ${styleBlock}

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
