import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { ScanPage } from "./components/ScanPage";
import { RecipesPage } from "./components/RecipesPage";
import { WeeklyPlanPage } from "./components/WeeklyPlanPage";
import { ShoppingListPage } from "./components/ShoppingListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "scan", Component: ScanPage },
      { path: "recipes", Component: RecipesPage },
      { path: "weekly-plan", Component: WeeklyPlanPage },
      { path: "shopping-list", Component: ShoppingListPage },
    ],
  },
]);
