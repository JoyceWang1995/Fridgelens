import { Router } from 'express';

const router = Router();

const GEMINI_MODEL = "gemini-2.5-flash-lite";

function getUrl() {
  const key = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "AIzaSyA4jraDWkgmDtBR2ma75MfkHy9naEk71JI";
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
}

async function callGemini(parts: object[]) {
  const res = await fetch(getUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      contents: [{ parts }],
      generationConfig: { responseMimeType: "application/json" }
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

router.post('/detect-ingredients', async (req, res) => {
   try {
     const { base64, mimeType } = req.body;
     const prompt = `You are a fridge/ingredient scanner. Look at this image and identify ALL visible food ingredients, produce, condiments, and food items.
Return ONLY a JSON array of ingredient name strings, no explanation. Example: ["Eggs", "Milk", "Tomatoes", "Cheese"]
Be specific but concise with names. Maximum 20 items.`;

     const text = await callGemini([
       { text: prompt },
       { inlineData: { mimeType: mimeType, data: base64 } },
     ]);
     
     const ingredients = JSON.parse(text);
     res.json({ ingredients: Array.isArray(ingredients) ? ingredients : [] });
   } catch (error: any) {
     console.error("Detect Ingredients Error:", error.message);
     res.status(500).json({ error: error.message });
   }
});

router.post('/generate-recipes', async (req, res) => {
   try {
     const { ingredients } = req.body;
     const prompt = `You are a chef AI. Given these ingredients: ${ingredients.join(", ")}

Generate 4 diverse recipe suggestions. For each recipe, mark each ingredient as "have: true" if it's in the provided list, otherwise "have: false".

Return ONLY valid JSON array, no markdown, no explanation:
[
  {
    "id": "1",
    "name": "Recipe Name",
    "image": "",
    "time": "25 min",
    "servings": 4,
    "difficulty": "Easy",
    "matchPercent": 90,
    "ingredients": [{"name": "...", "amount": "...", "have": true}],
    "instructions": ["Step 1...", "Step 2..."],
    "tags": ["Quick", "Healthy"]
  }
]

Rules:
- matchPercent = percentage of recipe ingredients the user already has (0-100)
- difficulty must be exactly "Easy", "Medium", or "Hard"
- include 3-6 ingredients per recipe
- include 4-6 instructions per recipe
- include 2-4 tags like: Quick, Healthy, Vegan, Vegetarian, High Protein, Low Carb, Budget, etc.
- image field should be empty string ""
- Make recipes realistic and varied`;

    const text = await callGemini([{ text: prompt }]);
    const recipes = JSON.parse(text);
    res.json({ recipes: Array.isArray(recipes) ? recipes : [] });
   } catch (error: any) {
     res.status(500).json({ error: error.message });
   }
});

router.post('/generate-weekly-plan', async (req, res) => {
   try {
     const { ingredients } = req.body;
     const prompt = `You are a meal planning chef AI. Given these ingredients: ${ingredients.join(", ")}

Create a 7-day meal plan that maximizes ingredient reuse and minimizes waste. Plan one meal per day.

Return ONLY valid JSON array for all 7 days, no markdown:
[
  {
    "day": "Monday",
    "meal": {
      "id": "1",
      "name": "Recipe Name",
      "image": "",
      "time": "25 min",
      "servings": 4,
      "difficulty": "Easy",
      "matchPercent": 85,
      "ingredients": [{"name": "...", "amount": "...", "have": true}],
      "instructions": ["Step 1", "Step 2"],
      "tags": ["Quick"]
    }
  }
]

Rules:
- Must include all 7 days: Monday through Sunday
- matchPercent = % of ingredients user already has
- difficulty: "Easy", "Medium", or "Hard"
- Use ingredients smartly across the week — batch-cook when possible
- image field: empty string ""
- Each meal should be distinct`;

     const text = await callGemini([{ text: prompt }]);
     const plan = JSON.parse(text);
     res.json({ plan: Array.isArray(plan) ? plan : [] });
   } catch (error: any) {
     res.status(500).json({ error: error.message });
   }
});

export default router;
