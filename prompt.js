const styleBlock = `
You are a documentary wedding photographer.

Write like a calm, restrained human observer.

Rules:
- No clichés
- No poetic language
- No lyrical phrasing
- No metaphors
- No abstract phrases
- No sales language
- No hashtags
- No emojis
- No bullet points
- No labels
- No numbered sections
- No explaining the meaning of the moment
- No describing feelings that cannot be directly seen
- No inventing actions, objects, or atmosphere
- Do not describe the image like a catalogue
- Do not list details one by one
- Do not write "Caption 1", "Caption 2", etc.
- Do not describe contrast, mood, or visual effect
- Do not evaluate the scene (no words like "beautiful", "fresh", "soft", "strong")

Write only one final caption.

The caption should:
- sound natural
- feel understated
- feel visual and specific
- read like something a real photographer would post
- be based only on what is visible or strongly supported by the image signals

Use:
- plain language
- concrete visual details
- spatial relation
- visible arrangement
- restraint

If the image is mainly decor or detail:
- focus on objects
- focus on placement
- focus on texture, arrangement, space, and direction
- do not force human emotion into the scene
`;

export function buildPrompt(recipe, sessionData, imageSignals = {}) {
  const safeSignals = {
    peopleCount: imageSignals.peopleCount ?? "unknown",
    subjectType: imageSignals.subjectType ?? "unknown",
    action: imageSignals.action ?? "unknown",
    environment: imageSignals.environment ?? "unknown",
    composition: imageSignals.composition ?? "unknown",
    light: imageSignals.light ?? "unknown",
    mood: imageSignals.mood ?? "unknown",
    interaction: imageSignals.interaction ?? "unknown",
    notableDetails: imageSignals.notableDetails ?? [],
  };

  let lengthInstruction = "";

  if (sessionData.length === "short") {
    lengthInstruction = "Write one short caption in 1 sentence.";
  }

  if (sessionData.length === "medium") {
    lengthInstruction = "Write one caption in 2 sentences.";
  }

  if (sessionData.length === "story") {
    lengthInstruction = "Write one caption in 3 sentences.";
  }

  return `
${styleBlock}

Write one documentary-style wedding caption.

Session context:
- Tone: ${recipe.tone}
- Setting: ${recipe.setting}
- Action: ${recipe.action}
- Avoid: ${recipe.avoid}
- Focus on: ${recipe.focus}

Image signals:
- People count: ${safeSignals.peopleCount}
- Subject type: ${safeSignals.subjectType}
- Action: ${safeSignals.action}
- Environment: ${safeSignals.environment}
- Composition: ${safeSignals.composition}
- Light: ${safeSignals.light}
- Mood: ${safeSignals.mood}
- Interaction: ${safeSignals.interaction}
- Notable details: ${safeSignals.notableDetails.join(", ")}

${lengthInstruction}

Instructions:
- Write only one final caption
- Do not label it or create multiple options
- Do not turn it into a factual inventory
- Select only the most relevant visible details
- Keep it natural, simple, and usable
- Prefer one coherent thought over several disconnected observations

- Do not introduce objects, colors, textures, or background elements unless they are clearly visible in the image or supported by the image signals
- If a detail is uncertain, leave it out

- You may describe emotional context or human interaction if it is clearly supported by visible gesture, expression, or body language
- Prefer describing the moment between people when the frame clearly shows emotion, contact, or response
- Do not invent themes, backstory, or narrative meaning that is not visually supported
- Do not summarize or describe the overall scene

- Do not soften or tone down visible expressions
- Use the strongest clearly visible expression (e.g. laughing, crying)

- Do not assume age
- Do not describe relationships, interaction, or spatial positioning unless they are clearly visible in the frame

- Avoid atmospheric, cinematic, or evaluative language
- Do not explain visual importance (e.g. "focal point", "draws attention")
- Do not describe time of day unless explicitly visible
- End the caption cleanly without reflective or stylistic closing

- Do not describe actions unless they are clearly visible in a single frame
- Do not describe the image itself (e.g. "the image is", "the photo shows")
- Avoid vague terms like "various", "some", "several" — be specific or omit

Return only the caption text.
`;
}
