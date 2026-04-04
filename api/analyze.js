// api/analyze.js — Vercel Serverless Function
// Uses Groq API (FREE - 1,000 requests/day)

const SYSTEM_PROMPT = `You are a YouTube monetization eligibility expert. When given a YouTube channel URL/handle/ID, analyze it thoroughly and respond ONLY with a valid JSON object (no markdown, no backticks, no extra text).

The JSON must follow this exact structure:
{
  "channel": {
    "name": "Channel Name",
    "handle": "@handle",
    "subscribers": "123K",
    "totalVideos": 45,
    "totalViews": "2.3M",
    "joinedDate": "Jan 2020",
    "category": "Gaming / Tech / etc",
    "description": "Short channel description",
    "country": "US",
    "avgViewsPerVideo": "51K"
  },
  "monetizationEligibility": {
    "overallScore": 72,
    "verdict": "LIKELY_ELIGIBLE",
    "ytpRequirements": {
      "subscribers": { "required": 1000, "estimated": 1200, "met": true },
      "watchHours": { "required": 4000, "estimated": 4500, "met": true },
      "communityGuidelines": { "met": true, "violations": 0 },
      "adsenseLinked": { "met": true }
    },
    "contentAnalysis": {
      "originalContent": { "score": 85, "notes": "Mostly original content" },
      "adFriendliness": { "score": 78, "notes": "Content is generally advertiser friendly" },
      "consistencyScore": { "score": 65, "notes": "Uploads somewhat irregular" },
      "engagementRate": { "score": 70, "notes": "Decent engagement ratio" },
      "spamRisk": { "score": 15, "notes": "Low spam risk" }
    },
    "policyCompliance": {
      "copyrightStatus": "CLEAN",
      "communityStrike": false,
      "ageRestricted": false,
      "externalLinks": "SAFE",
      "duplicationRisk": "LOW"
    }
  },
  "videos": [
    {
      "title": "Video Title",
      "views": "12K",
      "likes": "340",
      "duration": "8:24",
      "uploadDate": "2 weeks ago",
      "monetizable": true,
      "adFriendly": true,
      "issues": [],
      "score": 88
    }
  ],
  "recommendations": [
    "Tip 1",
    "Tip 2"
  ],
  "summary": "One paragraph honest assessment."
}

verdict must be one of: LIKELY_ELIGIBLE, BORDERLINE, NOT_ELIGIBLE
Include at least 6-8 videos. Be realistic and detailed.`;

const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "mixtral-8x7b-32768",
];

async function callGroq(apiKey, model, channelUrl) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  return await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this YouTube channel for monetization eligibility: ${channelUrl}` }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }

  const { url } = req.body;

  if (!url || !url.trim()) {
    return res.status(400).json({ error: "Please provide a YouTube channel URL" });
  }

  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be") || url.startsWith("@") || url.match(/^UC[a-zA-Z0-9_-]{22}$/);

  if (!isYouTube) {
    return res.status(400).json({ error: "Please enter a valid YouTube channel URL or @handle" });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: "API key not configured. Please set GROQ_API_KEY in environment variables." });
  }

  let lastError = "Unknown error";

  for (const model of MODELS) {
    try {
      console.log(`Trying Groq model: ${model}`);
      const response = await callGroq(GROQ_API_KEY, model, url);

      if (!response.ok) {
        if (response.status === 429 || response.status === 404) {
          console.log(`Model ${model} failed, trying next...`);
          continue;
        }
        return res.status(500).json({ error: "AI service error. Please try again." });
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();

      if (!clean) {
        continue;
      }

      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch (e) {
        continue;
      }

      console.log(`✅ Success with Groq model: ${model}`);
      return res.status(200).json(parsed);

    } catch (err) {
      console.error(`Error with model ${model}:`, err.message);
      lastError = err.message;
      continue;
    }
  }

  return res.status(429).json({
    error: "AI service temporarily unavailable. Please try again in a few minutes."
  });
}