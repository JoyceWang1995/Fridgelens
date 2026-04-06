import { useState } from "react";
import { motion } from "motion/react";
import { Check, ShoppingCart, Share2, Copy } from "lucide-react";
import { toast, Toaster } from "sonner";

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  checked: boolean;
}

const INITIAL_ITEMS: ShoppingItem[] = [
  { id: "1", name: "Fresh Basil", amount: "1 bunch", category: "Produce", checked: false },
  { id: "2", name: "Sesame Oil", amount: "1 bottle", category: "Pantry", checked: false },
  { id: "3", name: "Parsley", amount: "1 bunch", category: "Produce", checked: false },
  { id: "4", name: "Feta Cheese", amount: "50g", category: "Dairy", checked: false },
  { id: "5", name: "Chicken Stock", amount: "500ml", category: "Pantry", checked: false },
  { id: "6", name: "Heavy Cream", amount: "200ml", category: "Dairy", checked: false },
  { id: "7", name: "Pine Nuts", amount: "50g", category: "Pantry", checked: false },
  { id: "8", name: "Cherry Tomatoes", amount: "250g", category: "Produce", checked: false },
];

export function ShoppingListPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const toggleItem = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const categories = [...new Set(items.map(i => i.category))];
  const checkedCount = items.filter(i => i.checked).length;

  const copyList = () => {
    const text = items.filter(i => !i.checked).map(i => `☐ ${i.name} — ${i.amount}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Shopping list copied!");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl mb-1 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-emerald-500" />
            Shopping List
          </h1>
          <p className="text-muted-foreground text-sm">
            {checkedCount}/{items.length} items checked
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyList} className="p-2.5 rounded-xl border border-border hover:bg-accent transition-colors">
            <Copy className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl border border-border hover:bg-accent transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="h-2 rounded-full bg-accent overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${(checkedCount / items.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Items by category */}
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-sm text-muted-foreground mb-2">{category}</h3>
            <div className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-border/50">
              {items.filter(i => i.category === category).map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.checked ? "bg-emerald-500 border-emerald-500" : "border-border"
                  }`}>
                    {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                    {item.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.amount}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
