// Gemini AI service — uses our new backend Express REST API
export interface AIRecipe {
  id: string;
  name: string;
  image: string;
  time: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  matchPercent: number;
  ingredients: { name: string; amount: string; have: boolean }[];
  instructions: string[];
  tags: string[];
}

export interface WeeklyPlanDay {
  day: string;
  meal: AIRecipe;
}

/** Detect ingredients from a base64-encoded image */
export async function detectIngredientsFromImage(base64: string, mimeType: string): Promise<string[]> {
  const res = await fetch("/api/ai/detect-ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64, mimeType }),
  });
  if (!res.ok) {
    let msg = "API error";
    try {
      const errData = await res.json();
      msg = errData.error || msg;
    } catch {}
    throw new Error(String(msg));
  }
  const data = await res.json();
  return data.ingredients || [];
}

/** Generate recipe suggestions from a list of ingredients */
export async function generateRecipes(ingredients: string[]): Promise<AIRecipe[]> {
  const res = await fetch("/api/ai/generate-recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });
  if (!res.ok) {
    let msg = "API error";
    try {
      const errData = await res.json();
      msg = errData.error || msg;
    } catch {}
    throw new Error(String(msg));
  }
  const data = await res.json();
  const recipes: AIRecipe[] = data.recipes || [];
  return recipes.map((r, i) => ({
    ...r,
    id: String(i + 1),
    image: getRecipeImage(r.name),
  }));
}

/** Generate a 7-day weekly meal plan */
export async function generateWeeklyPlan(ingredients: string[]): Promise<WeeklyPlanDay[]> {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const res = await fetch("/api/ai/generate-weekly-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });
  if (!res.ok) {
    let msg = "API error";
    try {
      const errData = await res.json();
      msg = errData.error || msg;
    } catch {}
    throw new Error(String(msg));
  }
  const data = await res.json();
  const plan: WeeklyPlanDay[] = data.plan || [];
  return plan.map((p, i) => ({
    ...p,
    day: days[i] ?? p.day,
    meal: { ...p.meal, id: String(i + 1), image: getRecipeImage(p.meal.name) },
  }));
}

/** Collect all missing ingredients from a recipe list */
export function collectMissingIngredients(
  recipes: AIRecipe[]
): { id: string; name: string; amount: string; category: string; checked: boolean }[] {
  const seen = new Set<string>();
  const missing: { id: string; name: string; amount: string; category: string; checked: boolean }[] = [];

  recipes.forEach((recipe) => {
    recipe.ingredients
      .filter((ing) => !ing.have)
      .forEach((ing) => {
        const key = ing.name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          missing.push({
            id: `${Date.now()}-${missing.length}`,
            name: ing.name,
            amount: ing.amount,
            category: guessCategory(ing.name),
            checked: false,
          });
        }
      });
  });

  return missing;
}

function guessCategory(name: string): string {
  const n = name.toLowerCase();
  if (/milk|cheese|butter|yogurt|cream|dairy/.test(n)) return "Dairy";
  if (/chicken|beef|pork|lamb|salmon|fish|shrimp|egg|tofu|turkey/.test(n)) return "Proteins";
  if (/tomato|onion|pepper|broccoli|spinach|carrot|garlic|lettuce|mushroom|herb|basil|parsley|ginger/.test(n)) return "Produce";
  if (/apple|banana|berry|lemon|lime|orange|avocado|mango|fruit/.test(n)) return "Fruits";
  return "Pantry";
}

const RECIPE_IMAGES: Record<string, string> = {
  chicken: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80",
  pasta: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  stir: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
  rice: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
  egg: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
  beef: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
  veggie: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
  taco: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
  curry: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  default: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80",
};

function getRecipeImage(name: string): string {
  const n = name.toLowerCase();
  for (const [key, url] of Object.entries(RECIPE_IMAGES)) {
    if (n.includes(key)) return url;
  }
  return RECIPE_IMAGES.default;
}
