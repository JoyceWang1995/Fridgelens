import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Plus, X, Check, Sparkles, Upload } from "lucide-react";
import { INGREDIENT_CATEGORIES } from "./mock-data";

export function ScanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "cook-now";
  const isWeekly = mode === "weekly-plan";

  const [step, setStep] = useState<"scan" | "confirm">("scan");
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  const simulateScan = useCallback(() => {
    setScanning(true);
    // Simulate AI scanning
    setTimeout(() => {
      const all = Object.values(INGREDIENT_CATEGORIES).flat();
      const shuffled = all.sort(() => 0.5 - Math.random());
      setDetected(shuffled.slice(0, 8 + Math.floor(Math.random() * 5)));
      setScanning(false);
      setStep("confirm");
    }, 2000);
  }, []);

  const addIngredient = () => {
    if (customInput.trim() && !detected.includes(customInput.trim())) {
      setDetected([...detected, customInput.trim()]);
      setCustomInput("");
    }
  };

  const removeIngredient = (item: string) => {
    setDetected(detected.filter((d) => d !== item));
  };

  const toggleFromCategory = (item: string) => {
    if (detected.includes(item)) {
      removeIngredient(item);
    } else {
      setDetected([...detected, item]);
    }
  };

  const handleGenerate = () => {
    const route = isWeekly ? "/weekly-plan" : "/recipes";
    navigate(`${route}?ingredients=${encodeURIComponent(detected.join(","))}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl mb-2">
          {isWeekly ? "Scan for Weekly Plan" : "Scan Your Fridge"}
        </h1>
        <p className="text-muted-foreground">
          {step === "scan"
            ? "Upload a photo or manually add ingredients"
            : `${detected.length} ingredients detected — edit and confirm`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "scan" ? (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Scan Area */}
            <button
              onClick={simulateScan}
              disabled={scanning}
              className="w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center gap-4 hover:bg-emerald-50 transition-colors mb-6"
            >
              {scanning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-12 h-12 text-emerald-500" />
                </motion.div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-emerald-600" />
                </div>
              )}
              <div>
                <p className={scanning ? "text-emerald-600" : ""}>
                  {scanning ? "AI is scanning your fridge..." : "Tap to scan your fridge"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {scanning ? "Detecting ingredients" : "Or upload a photo"}
                </p>
              </div>
              {!scanning && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  Upload image
                </div>
              )}
            </button>

            {/* Quick Add */}
            <div className="text-center text-sm text-muted-foreground mb-4">
              or add ingredients manually
            </div>
            <button
              onClick={() => {
                setDetected(["Chicken Breast", "Rice", "Garlic", "Onions", "Soy Sauce", "Bell Peppers", "Olive Oil", "Eggs"]);
                setStep("confirm");
              }}
              className="w-full py-3 rounded-xl border border-border hover:bg-accent transition-colors text-sm"
            >
              Skip scan — add manually
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Detected Ingredients */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {detected.map((item) => (
                  <motion.span
                    key={item}
                    layout
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm"
                  >
                    {item}
                    <button onClick={() => removeIngredient(item)} className="hover:text-emerald-950">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                ))}
              </div>

              {/* Custom Input */}
              <div className="flex gap-2">
                <input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                  placeholder="Add an ingredient..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-input-background border border-border"
                />
                <button
                  onClick={addIngredient}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Category Quick Add */}
            <div className="space-y-4 mb-8">
              {Object.entries(INGREDIENT_CATEGORIES).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm text-muted-foreground capitalize mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => {
                      const selected = detected.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleFromCategory(item)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            selected
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "border-border hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 inline mr-1" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Generate Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={detected.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {isWeekly ? "Generate Weekly Plan" : "Generate Recipes"}
              <span className="text-emerald-200 text-sm">({detected.length} ingredients)</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
