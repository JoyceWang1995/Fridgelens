import { useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Plus, X, Check, Sparkles, Upload, AlertCircle } from "lucide-react";
import { INGREDIENT_CATEGORIES } from "./mock-data";
import { detectIngredientsFromImage } from "../services/ai";
import { saveIngredients } from "../services/db";

export function ScanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "cook-now";
  const isWeekly = mode === "weekly-plan";

  const [step, setStep] = useState<"scan" | "confirm">("scan");
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = useCallback(async (file: File) => {
    setError(null);
    setScanning(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const base64 = await fileToBase64(file);
      const ingredients = await detectIngredientsFromImage(base64, file.type);
      if (ingredients.length === 0) {
        setError("Couldn't detect ingredients. Try a clearer photo or add manually.");
        setDetected([]);
      } else {
        setDetected(ingredients);
      }
      setStep("confirm");
    } catch (err: any) {
      setError(`AI scan failed: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setScanning(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) handleImageFile(file);
    },
    [handleImageFile]
  );

  const addIngredient = () => {
    const val = customInput.trim();
    if (val && !detected.includes(val)) {
      setDetected((prev) => [...prev, val]);
      setCustomInput("");
    }
  };

  const removeIngredient = (item: string) => {
    setDetected((prev) => prev.filter((d) => d !== item));
  };

  const toggleFromCategory = (item: string) => {
    setDetected((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleGenerate = async () => {
    await saveIngredients(detected);
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
            ? "Upload a photo and AI will detect your ingredients"
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
            {/* Hidden file input */}
            <input
              id="image-scan-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Drop Zone */}
            <label
              htmlFor={!scanning ? "image-scan-input" : undefined}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center gap-4 hover:bg-emerald-50 transition-colors mb-4 ${scanning ? "cursor-default" : "cursor-pointer"}`}
            >
              {scanning ? (
                <>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-30"
                    />
                  )}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                  <div>
                    <p className="text-emerald-600 font-medium">AI is scanning your fridge...</p>
                    <p className="text-sm text-muted-foreground mt-1">Detecting ingredients</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p>Tap to upload a fridge photo</p>
                    <p className="text-sm text-muted-foreground mt-1">or drag and drop an image</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="w-4 h-4" />
                    JPG, PNG, WEBP supported
                  </div>
                </>
              )}
            </button>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Manual skip */}
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
            {/* Preview thumbnail */}
            {previewUrl && (
              <div className="relative mb-6 rounded-2xl overflow-hidden h-40">
                <img src={previewUrl} alt="Scanned" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white text-sm">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  AI detected {detected.length} ingredients
                </div>
                <button
                  onClick={() => { setStep("scan"); setPreviewUrl(null); setDetected([]); }}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

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
                {detected.length === 0 && (
                  <p className="text-sm text-muted-foreground">No ingredients yet. Add some below.</p>
                )}
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

// Convert File to base64 string (without data URL prefix)
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip "data:image/...;base64," prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
