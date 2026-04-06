import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Users, ShoppingCart, Check, X, ChefHat, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { generateRecipes, collectMissingIngredients, type AIRecipe } from "../services/ai";
import { getRecipes, saveRecipes, getIngredients, mergeShoppingItems } from "../services/db";
import { MOCK_RECIPES } from "./mock-data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function RecipesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRecipe, setSelectedRecipe] = useState<AIRecipe | null>(null);
  const [recipes, setRecipes] = useState<AIRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const ingredientsParam = searchParams.get("ingredients");

  useEffect(() => {
    // Clear stale cache whenever new ingredients arrive from scan
    if (ingredientsParam) {
      const ingredients = ingredientsParam.split(",").map((s) => s.trim()).filter(Boolean);
      if (ingredients.length > 0) {
        fetchRecipes(ingredients);
        navigate("/recipes", { replace: true });
        return;
      }
    }
    // No URL params — load from cache or DB
    const loadCached = async () => {
      const cached = await getRecipes();
      if (cached.length > 0) {
        setRecipes(cached);
      } else {
        const saved = await getIngredients();
        if (saved.length > 0) {
          fetchRecipes(saved);
        } else {
          setRecipes(MOCK_RECIPES as unknown as AIRecipe[]);
        }
      }
    };
    loadCached();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientsParam]);

  async function fetchRecipes(ingredients: string[]) {
    setLoading(true);
    setError(null);
    try {
      const result = await generateRecipes(ingredients);
      if (result.length === 0) throw new Error("No recipes returned");
      setRecipes(result);
      await saveRecipes(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate recipes. Showing cached results.");
      const cached = await getRecipes();
      setRecipes(cached.length > 0 ? cached : (MOCK_RECIPES as unknown as AIRecipe[]));
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = async () => {
    const ingredients = ingredientsParam
      ? ingredientsParam.split(",").map((s) => s.trim()).filter(Boolean)
      : await getIngredients();
    if (ingredients.length > 0) fetchRecipes(ingredients);
  };

  const handleAddToShoppingList = async (recipe: AIRecipe) => {
    const missing = collectMissingIngredients([recipe]);
    await mergeShoppingItems(missing);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {!selectedRecipe ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl mb-1">Recipe Suggestions</h1>
                <p className="text-muted-foreground text-sm">
                  {loading ? "AI is generating recipes…" : "AI-matched recipes based on your ingredients"}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2.5 rounded-xl border border-border hover:bg-accent transition-colors disabled:opacity-50"
                title="Regenerate recipes"
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
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-2xl border border-border overflow-hidden bg-white animate-pulse">
                    <div className="h-44 bg-emerald-50" />
                    <div className="p-4 space-y-2">
                      <div className="h-5 bg-gray-100 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {recipes.map((recipe, i) => (
                  <motion.button
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="text-left rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group bg-white"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <ImageWithFallback
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-sm text-emerald-700">
                        {recipe.matchPercent}% match
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg mb-2">{recipe.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{recipe.time}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{recipe.servings} servings</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">{recipe.difficulty}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-accent px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button
              onClick={() => setSelectedRecipe(null)}
              className="text-sm text-muted-foreground mb-4 hover:text-foreground flex items-center gap-1"
            >
              ← Back to recipes
            </button>

            <div className="rounded-2xl overflow-hidden border border-border bg-white">
              <div className="relative h-56 md:h-72">
                <ImageWithFallback
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h1 className="text-2xl md:text-3xl mb-2">{selectedRecipe.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedRecipe.time}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{selectedRecipe.servings} servings</span>
                    <span>{selectedRecipe.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h2 className="text-lg mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-emerald-500" />
                    Ingredients
                  </h2>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ing) => (
                      <li
                        key={ing.name}
                        className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          {ing.have ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-400" />
                          )}
                          <span className={!ing.have ? "text-red-600" : ""}>{ing.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{ing.amount}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedRecipe.ingredients.some((i) => !i.have) && (
                    <button
                      onClick={async () => {
                        await handleAddToShoppingList(selectedRecipe);
                        navigate("/shopping-list");
                      }}
                      className="mt-4 w-full py-2.5 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {addedToCart ? "Added to shopping list!" : "Add missing to shopping list"}
                    </button>
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <h2 className="text-lg mb-4">Instructions</h2>
                  <ol className="space-y-4">
                    {selectedRecipe.instructions.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">
                          {i + 1}
                        </span>
                        <p className="text-sm pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
