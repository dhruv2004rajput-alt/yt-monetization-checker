// api/analyze.js — Vercel Serverless Function
// Uses Google Gemini API (FREE)

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

// Models to try in order (fallback if one is rate limited)
const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b",
];

async function callGemini(apiKey, model, channelUrl) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  return await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nAnalyze this YouTube channel for monetization eligibility: ${channelUrl}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000
      }
    })
  });
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check request body exists
  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }

  const { url } = req.body;

  // Validate URL input
  if (!url || !url.trim()) {
    return res.status(400).json({ error: "Please provide a YouTube channel URL" });
  }

  // Basic YouTube URL/handle validation
  const isYouTube =
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.startsWith("@") ||
    url.match(/^UC[a-zA-Z0-9_-]{22}$/);

  if (!isYouTube) {
    return res.status(400).json({ error: "Please enter a valid YouTube channel URL or @handle" });
  }

  // ✅ SAFE: API key from environment variable only
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "API key not configured. Please set GEMINI_API_KEY in Vercel environment variables." });
  }

  // Try each model in order until one works
  let lastError = "Unknown error";

  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await callGemini(GEMINI_API_KEY, model, url);

      if (!response.ok) {
        const errData = await response.json();
        const code = errData?.error?.code;

        // If quota exceeded (429) or model not found (404), try next model
        if (code === 429 || code === 404) {
          console.log(`Model ${model} failed with code ${code}, trying next model...`);
          lastError = errData?.error?.message || "Quota exceeded";
          continue;
        }

        // For other errors stop immediately
        console.error("Gemini API error:", errData);
        return res.status(500).json({ error: "AI service error: " + (errData?.error?.message || "Unknown") });
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();

      if (!clean) {
        lastError = "Empty response from AI";
        console.log(`Model ${model} returned empty response, trying next...`);
        continue;
      }

      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch (e) {
        console.error("JSON parse failed for model", model, "Raw:", text.substring(0, 200));
        lastError = "Failed to parse AI response";
        continue;
      }

      console.log(`✅ Success with model: ${model}`);
      return res.status(200).json(parsed);

    } catch (err) {
      console.error(`Network error with model ${model}:`, err.message);
      lastError = err.message;
      continue;
    }
  }

  // All models failed
  console.error("All models failed. Last error:", lastError);
  return res.status(429).json({
    error: "AI quota exceeded on all models. Please wait a few minutes and try again. Quota resets every 24 hours."
  });
}
