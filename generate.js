const MAX_INPUT = 5000;

function clean(value, fallback = "") {
  return String(value ?? fallback).trim().slice(0, MAX_INPUT);
}

function buildPrompt(body) {
  const type = clean(body.type, "script");

  if (type === "script") {
    return `You are PeeJay AI Creator Studio, a professional content-writing assistant. Create a production-ready video script.

Topic: ${clean(body.topic, "an inspiring creator story")}
Platform: ${clean(body.platform, "YouTube")}
Length: ${clean(body.length, "60 seconds")}
Tone: ${clean(body.tone, "Cinematic & inspiring")}

Requirements:
- Start with a strong hook.
- Structure the script into clear scenes.
- Include visual direction, narration/dialogue, pacing and a strong ending.
- Make it practical and ready to use for AI video production.
- Match the requested length as closely as possible.
- End with a natural call to action.
- Return plain text only.`;
  }

  if (type === "prompt") {
    return `You are PeeJay AI Creator Studio, an expert AI image and video prompt engineer. Write one highly detailed production prompt.

Scene description: ${clean(body.topic, "a professional AI creator")}
Format: ${clean(body.format, "Cinematic image prompt")}
Visual style: ${clean(body.style, "Photorealistic cinematic")}

Requirements:
- Describe subject, environment, wardrobe, lighting, composition, camera, lens feel, depth of field, atmosphere, textures and cinematic quality where relevant.
- If the scene includes a recurring character, preserve identity consistency.
- Make the prompt directly usable in modern AI image/video generators.
- Return only the final prompt, with no explanation.`;
  }

  if (type === "caption") {
    return `You are PeeJay AI Creator Studio, a social-media copywriter. Write an engaging caption.

Post topic: ${clean(body.topic, "my latest creator project")}
Platform: ${clean(body.platform, "Instagram")}

Requirements:
- Strong opening line.
- Natural, human tone.
- Encourage comments or engagement.
- Add relevant hashtags without overloading them.
- Return only the caption.`;
  }

  if (type === "ideas") {
    return `You are PeeJay AI Creator Studio, a YouTube/TikTok content strategist. Generate 10 original content ideas.

Niche: ${clean(body.niche, "AI content creation")}

Requirements:
- Make the ideas specific and useful.
- Mix tutorials, curiosity, storytelling, mistakes, challenges, trends and money/business angles where appropriate.
- Give each idea a short compelling title.
- Number them 1 to 10.
- Return plain text only.`;
  }

  throw new Error("Unsupported generation type");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured in Vercel." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const input = buildPrompt(body);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-6-astra",
        input,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(response.status).json({
        error: data?.error?.message || "The AI service returned an error.",
      });
    }

    return res.status(200).json({ output: data.output_text || "No output was returned." });
  } catch (error) {
    console.error("Generation error:", error);
    return res.status(500).json({ error: "Could not generate content. Please try again." });
  }
};
