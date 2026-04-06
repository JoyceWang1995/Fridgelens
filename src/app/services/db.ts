// Client-side database API hitting SQLite backend
import type { AIRecipe, WeeklyPlanDay } from "./ai";

const KEYS = {
  ingredients: "fridgeai:ingredients",
  recipes: "fridgeai:recipes",
  weeklyPlan: "fridgeai:weeklyPlan",
  shoppingList: "fridgeai:shoppingList",
} as const;

async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`/api/db/${key}`);
    const json = await res.json();
    return json.data === undefined || json.data === null ? fallback : json.data;
  } catch (err) {
    console.error("DB Load Error:", err);
    return fallback;
  }
}

async function save(key: string, value: unknown): Promise<void> {
  try {
    await fetch(`/api/db/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: value })
    });
  } catch (err) {
    console.error("DB Save Error:", err);
  }
}

// ─── Ingredients ──────────────────────────────────────────────────────────────

export function getIngredients(): Promise<string[]> {
  return load<string[]>(KEYS.ingredients, []);
}

export function saveIngredients(ingredients: string[]): Promise<void> {
  return save(KEYS.ingredients, ingredients);
}

// ─── Recipes ──────────────────────────────────────────────────────────────────

export function getRecipes(): Promise<AIRecipe[]> {
  return load<AIRecipe[]>(KEYS.recipes, []);
}

export function saveRecipes(recipes: AIRecipe[]): Promise<void> {
  return save(KEYS.recipes, recipes);
}

// ─── Weekly Plan ──────────────────────────────────────────────────────────────

export function getWeeklyPlan(): Promise<WeeklyPlanDay[]> {
  return load<WeeklyPlanDay[]>(KEYS.weeklyPlan, []);
}

export function saveWeeklyPlan(plan: WeeklyPlanDay[]): Promise<void> {
  return save(KEYS.weeklyPlan, plan);
}

// ─── Shopping List ────────────────────────────────────────────────────────────

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  checked: boolean;
}

export function getShoppingList(): Promise<ShoppingItem[]> {
  return load<ShoppingItem[]>(KEYS.shoppingList, []);
}

export function saveShoppingList(items: ShoppingItem[]): Promise<void> {
  return save(KEYS.shoppingList, items);
}

export async function mergeShoppingItems(newItems: ShoppingItem[]): Promise<void> {
  const existing = await getShoppingList();
  const existingNames = new Set(existing.map((i) => i.name.toLowerCase()));
  const toAdd = newItems.filter((i) => !existingNames.has(i.name.toLowerCase()));
  await saveShoppingList([...existing, ...toAdd]);
}

export async function clearAll(): Promise<void> {
  await fetch('/api/db', { method: 'DELETE' });
}
