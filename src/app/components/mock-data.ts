export const INGREDIENT_CATEGORIES = {
  proteins: ["Chicken Breast", "Ground Beef", "Eggs", "Salmon", "Tofu", "Shrimp", "Bacon", "Turkey"],
  vegetables: ["Tomatoes", "Onions", "Bell Peppers", "Broccoli", "Spinach", "Carrots", "Garlic", "Zucchini", "Mushrooms", "Lettuce"],
  dairy: ["Milk", "Cheese", "Butter", "Yogurt", "Cream", "Parmesan"],
  pantry: ["Rice", "Pasta", "Olive Oil", "Soy Sauce", "Salt", "Pepper", "Flour", "Sugar", "Bread", "Tortillas"],
  fruits: ["Lemons", "Avocado", "Bananas", "Apples", "Berries"],
};

export interface Recipe {
  id: string;
  name: string;
  image: string;
  time: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  matchPercent: number;
  ingredients: { name: string; amount: string; have: boolean }[];
  instructions: string[];
  tags: string[];
}

export const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Garlic Butter Chicken",
    image: "https://images.unsplash.com/photo-1722169474498-eb7fe1f59694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMGNvb2tpbmclMjBwbGF0ZXxlbnwxfHx8fDE3NzQ0NTM1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "25 min",
    servings: 4,
    difficulty: "Easy",
    matchPercent: 95,
    ingredients: [
      { name: "Chicken Breast", amount: "500g", have: true },
      { name: "Butter", amount: "3 tbsp", have: true },
      { name: "Garlic", amount: "4 cloves", have: true },
      { name: "Lemon", amount: "1", have: true },
      { name: "Parsley", amount: "2 tbsp", have: false },
    ],
    instructions: [
      "Season chicken breasts with salt and pepper.",
      "Heat butter in a large skillet over medium-high heat.",
      "Cook chicken for 6-7 minutes per side until golden.",
      "Add minced garlic and cook for 1 minute.",
      "Squeeze lemon juice over chicken and serve.",
    ],
    tags: ["Quick", "High Protein", "Low Carb"],
  },
  {
    id: "2",
    name: "Tomato Basil Pasta",
    image: "https://images.unsplash.com/photo-1713449585065-e35323ae644d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHRvbWF0byUyMGRpbm5lciUyMHBsYXRlfGVufDF8fHx8MTc3NDQ1MzU0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    time: "20 min",
    servings: 2,
    difficulty: "Easy",
    matchPercent: 88,
    ingredients: [
      { name: "Pasta", amount: "250g", have: true },
      { name: "Tomatoes", amount: "4 large", have: true },
      { name: "Garlic", amount: "3 cloves", have: true },
      { name: "Olive Oil", amount: "2 tbsp", have: true },
      { name: "Fresh Basil", amount: "handful", have: false },
      { name: "Parmesan", amount: "50g", have: true },
    ],
    instructions: [
      "Cook pasta according to package directions.",
      "Dice tomatoes and mince garlic.",
      "Heat olive oil, sauté garlic for 30 seconds.",
      "Add tomatoes and cook for 10 minutes.",
      "Toss with pasta, top with parmesan and basil.",
    ],
    tags: ["Vegetarian", "Quick", "Budget"],
  },
  {
    id: "3",
    name: "Veggie Stir Fry",
    image: "https://images.unsplash.com/photo-1761314025701-34795be5f737?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwc3RpciUyMGZyeSUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzc0NDUwMDc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "15 min",
    servings: 3,
    difficulty: "Easy",
    matchPercent: 92,
    ingredients: [
      { name: "Bell Peppers", amount: "2", have: true },
      { name: "Broccoli", amount: "1 head", have: true },
      { name: "Carrots", amount: "2", have: true },
      { name: "Soy Sauce", amount: "3 tbsp", have: true },
      { name: "Rice", amount: "1.5 cups", have: true },
      { name: "Sesame Oil", amount: "1 tbsp", have: false },
    ],
    instructions: [
      "Cook rice according to package directions.",
      "Slice all vegetables into thin strips.",
      "Heat oil in a wok over high heat.",
      "Stir fry vegetables for 4-5 minutes.",
      "Add soy sauce and toss. Serve over rice.",
    ],
    tags: ["Vegan", "Quick", "Healthy"],
  },
  {
    id: "4",
    name: "Fresh Garden Salad",
    image: "https://images.unsplash.com/photo-1605034298551-baacf17591d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bCUyMGhlYWx0aHl8ZW58MXx8fHwxNzc0NDA1NDUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "10 min",
    servings: 2,
    difficulty: "Easy",
    matchPercent: 80,
    ingredients: [
      { name: "Lettuce", amount: "1 head", have: true },
      { name: "Tomatoes", amount: "2", have: true },
      { name: "Avocado", amount: "1", have: true },
      { name: "Olive Oil", amount: "2 tbsp", have: true },
      { name: "Lemon", amount: "1", have: true },
      { name: "Feta Cheese", amount: "50g", have: false },
    ],
    instructions: [
      "Wash and chop lettuce into bite-sized pieces.",
      "Dice tomatoes and slice avocado.",
      "Combine all vegetables in a large bowl.",
      "Drizzle with olive oil and lemon juice.",
      "Season with salt and pepper. Toss gently.",
    ],
    tags: ["Vegan", "No Cook", "Healthy", "Quick"],
  },
];

export interface WeeklyPlan {
  day: string;
  meal: Recipe;
}

export const MOCK_WEEKLY_PLAN: WeeklyPlan[] = [
  { day: "Monday", meal: MOCK_RECIPES[0] },
  { day: "Tuesday", meal: MOCK_RECIPES[1] },
  { day: "Wednesday", meal: MOCK_RECIPES[2] },
  { day: "Thursday", meal: MOCK_RECIPES[3] },
  { day: "Friday", meal: MOCK_RECIPES[0] },
  { day: "Saturday", meal: MOCK_RECIPES[1] },
  { day: "Sunday", meal: MOCK_RECIPES[2] },
];
