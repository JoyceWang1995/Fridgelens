import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Users, ChevronRight, ShoppingCart, Check, X, ChefHat } from "lucide-react";
import { MOCK_RECIPES, type Recipe } from "./mock-data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function RecipesPage() {
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {!selectedRecipe ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl mb-1">Recipe Suggestions</h1>
                <p className="text-muted-foreground text-sm">AI-matched recipes based on your ingredients</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {MOCK_RECIPES.map((recipe, i) => (
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
                      {recipe.tags.map(tag => (
                        <span key={tag} className="text-xs bg-accent px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => setSelectedRecipe(null)} className="text-sm text-muted-foreground mb-4 hover:text-foreground flex items-center gap-1">
              ← Back to recipes
            </button>

            <div className="rounded-2xl overflow-hidden border border-border bg-white">
              <div className="relative h-56 md:h-72">
                <ImageWithFallback src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-full object-cover" />
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
                    {selectedRecipe.ingredients.map(ing => (
                      <li key={ing.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
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
                  {selectedRecipe.ingredients.some(i => !i.have) && (
                    <button
                      onClick={() => navigate("/shopping-list")}
                      className="mt-4 w-full py-2.5 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add missing to shopping list
                    </button>
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <h2 className="text-lg mb-4">Instructions</h2>
                  <ol className="space-y-4">
                    {selectedRecipe.instructions.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">{i + 1}</span>
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
