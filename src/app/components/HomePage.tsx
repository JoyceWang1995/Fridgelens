import { Zap, CalendarDays, Camera, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">AI-Powered Meal Decisions</span>
        </div>
        <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          What's in your fridge?
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-lg">
          Scan your ingredients, get instant recipes. Reduce food waste and cook more at home.
        </p>
      </motion.div>

      {/* Mode Selection */}
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/scan?mode=cook-now")}
          className="group relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-left hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100 transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl mb-2">Cook Now</h2>
          <p className="text-muted-foreground text-sm">
            Get instant recipe suggestions based on what you have. Perfect for quick meal decisions.
          </p>
          <div className="mt-4 text-emerald-600 text-sm flex items-center gap-1">
            <Camera className="w-4 h-4" />
            Scan & cook in 30 seconds
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/scan?mode=weekly-plan")}
          className="group relative overflow-hidden rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-8 text-left hover:border-violet-400 hover:shadow-lg hover:shadow-violet-100 transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-violet-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <CalendarDays className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl mb-2">Weekly Plan</h2>
          <p className="text-muted-foreground text-sm">
            Generate a structured 7-day meal plan. Reduce food waste with smart ingredient reuse.
          </p>
          <div className="mt-4 text-violet-600 text-sm flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            AI-planned 7-day meals
          </div>
        </motion.button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center"
      >
        {[
          { value: "< 30s", label: "Decision time" },
          { value: "40%", label: "Less food waste" },
          { value: "5x", label: "More home cooking" },
        ].map((stat) => (
          <div key={stat.label} className="p-4">
            <div className="text-2xl text-emerald-600">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
