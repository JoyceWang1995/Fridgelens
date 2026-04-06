import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, ShoppingCart, Share2, Copy, Trash2, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";
import { getShoppingList, saveShoppingList, type ShoppingItem } from "../services/db";

export function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    getShoppingList().then(setItems);
  }, []);

  const persist = async (updated: ShoppingItem[]) => {
    setItems(updated);
    await saveShoppingList(updated);
  };

  const toggleItem = (id: string) => {
    persist(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  const removeItem = (id: string) => {
    persist(items.filter((i) => i.id !== id));
  };

  const clearChecked = () => {
    persist(items.filter((i) => !i.checked));
    toast.success("Checked items removed");
  };

  const copyList = async () => {
    const text = items
      .filter((i) => !i.checked)
      .map((i) => `☐ ${i.name} — ${i.amount}`)
      .join("\n");
      
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Shopping list copied!");
    } catch (err) {
      window.prompt("Your browser blocked the clipboard. Copy this text:", text);
    }
  };

  const handleShare = async () => {
    const text = items.map((i) => `${i.checked ? "☑" : "☐"} ${i.name} — ${i.amount}`).join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Shopping List", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("List copied to clipboard!");
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
         window.prompt("Share/Copy failed via HTTP. Copy this text:", text);
      }
    }
  };

  const handleAddManualItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      amount: "1",
      category: "Added manually",
      checked: false,
    };
    await persist([...items, newItem]);
    setNewItemName("");
    toast.success("Item added");
  };

  const categories = [...new Set(items.map((i) => i.category))];
  const checkedCount = items.filter((i) => i.checked).length;

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
          {checkedCount > 0 && (
            <button
              onClick={clearChecked}
              className="p-2.5 rounded-xl border border-border hover:bg-red-50 hover:border-red-200 transition-colors"
              title="Remove checked items"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          )}
          <button
            onClick={copyList}
            className="p-2.5 rounded-xl border border-border hover:bg-accent transition-colors"
            title="Copy list"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-border hover:bg-accent transition-colors"
            title="Share list"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Manual Add Item Form */}
      <form onSubmit={handleAddManualItem} className="flex flex-col sm:flex-row gap-2 mb-8">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add an item manually..."
          className="flex-1 p-3 rounded-xl border border-border outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
        <button
          type="submit"
          disabled={!newItemName.trim()}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add
        </button>
      </form>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 rounded-full bg-accent overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${items.length > 0 ? (checkedCount / items.length) * 100 : 0}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
          <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-xl mb-2 text-muted-foreground">Shopping list is empty</h2>
          <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
            Generate recipes or a weekly plan, then add missing ingredients here. Or just type to add manually!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const catItems = items.filter((i) => i.category === category);
            if (catItems.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="text-sm text-muted-foreground mb-2">{category}</h3>
                <div className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-border/50">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition-colors group"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                          item.checked
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-border"
                        }`}
                      >
                        {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                      <span
                        className={`flex-1 text-left truncate ${
                          item.checked ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="text-sm text-muted-foreground truncate max-w-[80px] text-right">
                        {item.amount}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
