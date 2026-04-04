// api/analyze.js — Vercel Serverless Function
// Uses Google Gemini API (FREE) instead of Anthropic

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

  try {
    // ✅ SAFE: API key loaded from environment variable (never hardcode it!)
    const GEMINI_API_KEY = "AIzaSyA5pyh2ypWZZM5Or0J6WFxePGsBX4WWOiE";

    // Check if API key is configured
   if (!GEMINI_API_KEY) {
  return res.status(500).json({ error: "API KEY IS MISSING" });
}
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nAnalyze this YouTube channel for monetization eligibility: ${url}`
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

    // Handle Gemini API errors
    if (!response.ok) {
      const errData = await response.json();
      console.error("Gemini API error:", errData);
      return res.status(500).json({ error: "AI service error. Please try again." });
    }

    const data = await response.json();

    // Extract text from Gemini response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean markdown formatting if present
    const clean = text.replace(/```json|```/g, "").trim();

    // Guard against empty response
    if (!clean) {
      return res.status(500).json({ error: "Empty response from AI. Please try again." });
    }

    // Parse JSON response
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error("JSON parse failed. Raw text:", text);
      return res.status(500).json({ error: "Failed to parse AI response. Please try again." });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
}
