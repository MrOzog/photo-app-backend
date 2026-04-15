export function buildRecipe(sessionData) {
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

  return { tone, setting, action, avoid, focus };
}