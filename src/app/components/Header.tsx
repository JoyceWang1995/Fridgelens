import { ChefHat, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg text-emerald-600">Fridge AI</span>
        </button>
      </div>
    </header>
  );
}
