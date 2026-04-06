import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Clock, Users, ShoppingCart, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { MOCK_WEEKLY_PLAN } from "./mock-data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function WeeklyPlanPage() {
  const navigate = useNavigate();
  const [expandedDay, setExpandedDay] = useState<string | null>("Monday");

  const dayColors: Record<string, string> = {
    Monday: "bg-emerald-500",
    Tuesday: "bg-blue-500",
    Wednesday: "bg-violet-500",
    Thursday: "bg-amber-500",
    Friday: "bg-rose-500",
    Saturday: "bg-teal-500",
    Sunday: "bg-indigo-500",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl mb-1">Weekly Meal Plan</h1>
          <p className="text-muted-foreground text-sm">7 meals optimized for your ingredients</p>
        </div>
        <button className="p-2.5 rounded-xl border border-border hover:bg-accent transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {MOCK_WEEKLY_PLAN.map(({ day, meal }, i) => {
          const expanded = expandedDay === day;
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
                <div className={`w-10 h-10 rounded-xl ${dayColors[day]} flex items-center justify-center text-white text-sm`}>
                  {day.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{day}</div>
                  <div className="truncate">{meal.name}</div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="hidden sm:flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{meal.time}</span>
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
                      <ImageWithFallback src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{meal.time}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{meal.servings}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">{meal.difficulty}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {meal.ingredients.slice(0, 5).map(ing => (
                          <span key={ing.name} className={`text-xs px-2 py-0.5 rounded-full ${ing.have ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {ing.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {meal.tags.map(tag => (
                          <span key={tag} className="text-xs bg-accent px-2 py-0.5 rounded-full">{tag}</span>
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

      <button
        onClick={() => navigate("/shopping-list")}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all"
      >
        <ShoppingCart className="w-5 h-5" />
        Generate Shopping List
      </button>
    </div>
  );
}
