import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import {
  Clock,
  Users,
  ShoppingCart,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { generateWeeklyPlan, collectMissingIngredients, type WeeklyPlanDay } from "../services/ai";
import { getWeeklyPlan, saveWeeklyPlan, getIngredients, mergeShoppingItems } from "../services/db";
import { MOCK_WEEKLY_PLAN } from "./mock-data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const DAY_COLORS: Record<string, string> = {
  Monday: "bg-emerald-500",
  Tuesday: "bg-blue-500",
  Wednesday: "bg-violet-500",
  Thursday: "bg-amber-500",
  Friday: "bg-rose-500",
  Saturday: "bg-teal-500",
  Sunday: "bg-indigo-500",
};

export function WeeklyPlanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState<WeeklyPlanDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>("Monday");

  const ingredientsParam = searchParams.get("ingredients");

  useEffect(() => {
    // Always regenerate when fresh ingredients come from scan
    if (ingredientsParam) {
      const ingredients = ingredientsParam.split(",").map((s) => s.trim()).filter(Boolean);
      if (ingredients.length > 0) {
        fetchPlan(ingredients);
        return;
      }
    }
    // No URL params — load from cache or DB
    const loadCached = async () => {
      const cached = await getWeeklyPlan();
      if (cached.length > 0) {
        setPlan(cached);
      } else {
        const saved = await getIngredients();
        if (saved.length > 0) {
          fetchPlan(saved);
        } else {
          setPlan(MOCK_WEEKLY_PLAN as unknown as WeeklyPlanDay[]);
        }
      }
    };
    loadCached();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientsParam]);

  async function fetchPlan(ingredients: string[]) {
    setLoading(true);
    setError(null);
    try {
      const result = await generateWeeklyPlan(ingredients);
      if (result.length === 0) throw new Error("No plan returned");
      setPlan(result);
      await saveWeeklyPlan(result);
      setExpandedDay(result[0]?.day ?? "Monday");
    } catch (err) {
      console.error(err);
      setError("Failed to generate plan. Showing cached results.");
      const cached = await getWeeklyPlan();
      setPlan(cached.length > 0 ? cached : (MOCK_WEEKLY_PLAN as unknown as WeeklyPlanDay[]));
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = async () => {
    const ingredients = ingredientsParam
      ? ingredientsParam.split(",").map((s) => s.trim()).filter(Boolean)
      : await getIngredients();
    if (ingredients.length > 0) fetchPlan(ingredients);
  };

  const handleGenerateShoppingList = async () => {
    const allMeals = plan.map((p) => p.meal);
    const missing = collectMissingIngredients(allMeals);
    await mergeShoppingItems(missing);
    navigate("/shopping-list");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl mb-1">Weekly Meal Plan</h1>
          <p className="text-muted-foreground text-sm">
            {loading ? "AI is building your meal plan…" : "7 meals optimized for your ingredients"}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2.5 rounded-xl border border-border hover:bg-accent transition-colors disabled:opacity-50"
          title="Regenerate plan"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-amber-700 text-sm mb-4 p-3 bg-amber-50 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3 mb-8">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-white p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm py-4">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Crafting your personalized 7-day plan…
          </div>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {plan.map(({ day, meal }, i) => {
            const expanded = expandedDay === day;
            const colorClass = DAY_COLORS[day] ?? "bg-gray-400";
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-white overflow-hidden"
              >
                <button
                  onClick={() => setExpandedDay(expanded ? null : day)}
                  className="w-full p-4 flex items-center gap-4 text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center text-white text-sm font-medium`}
                  >
                    {day.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">{day}</div>
                    <div className="truncate">{meal.name}</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="hidden sm:flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {meal.time}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {meal.matchPercent}%
                    </span>
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-border"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-36 sm:h-auto">
                        <ImageWithFallback
                          src={meal.image}
                          alt={meal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {meal.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {meal.servings}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                            {meal.difficulty}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {meal.ingredients.slice(0, 5).map((ing) => (
                            <span
                              key={ing.name}
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                ing.have
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {ing.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {meal.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-accent px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleGenerateShoppingList}
        disabled={plan.length === 0}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50"
      >
        <ShoppingCart className="w-5 h-5" />
        Generate Shopping List
      </button>
    </div>
  );
}
