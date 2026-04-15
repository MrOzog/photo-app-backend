const imageSchema = {
  peopleCount: null,
  subjectType: "", // couple, group, single, unknown
  action: "", // walking, standing, hugging, talking, looking, unknown
  environment: "", // field, street, forest, beach, indoors, unknown
  composition: "", // wide, medium, close, unknown
  light: "", // soft, harsh, backlit, overcast, indoor warm, unknown
  mood: "", // quiet, joyful, intimate, formal, playful, unknown
  interaction: "", // touching, close, apart, eye contact, no contact, unknown
  notableDetails: [], // e.g. ["dress moving", "hands nearly touching"]
};

module.exports = { imageSchema };