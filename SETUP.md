# Fridge AI - Setup & Running Guide

## Prerequisites

- **Node.js** 18+ (check with `node --version`)
- **npm** or **pnpm** (comes with Node.js)

## Installation & Running

### 1. Install Dependencies
```bash
cd '/Users/kak/Downloads/Fridge AI PRD'
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173` (or similar port shown in terminal).

### 3. Build for Production
```bash
npm run build
```

Output goes to `dist/` folder.

---

## How to Use the App

### 🏠 Home Page
- Choose between **"Cook Now"** (instant recipes) or **"Weekly Plan"** (7-day meal planning)

### 📸 Scan Page
1. **Upload a fridge photo** — Click the scan area or drag & drop an image
2. AI will detect ingredients automatically
3. **Edit ingredients** — Add/remove items manually using the category buttons
4. Click **"Generate Recipes"** or **"Generate Weekly Plan"**

### 🍳 Recipes Page
- View AI-generated recipes matched to your ingredients
- Each recipe shows:
  - Match percentage (% of ingredients you have)
  - Time, servings, difficulty
  - Ingredients (✓ have, ✗ need to buy)
  - Step-by-step instructions
- Click **"Add missing to shopping list"** to auto-populate shopping items

### 📅 Weekly Plan Page
- 7-day meal plan optimized for ingredient reuse
- Click each day to expand and see full recipe details
- Click **"Generate Shopping List"** to collect all missing ingredients

### 🛒 Shopping List Page
- All missing ingredients organized by category (Produce, Dairy, Pantry, etc.)
- Check off items as you shop
- **Copy** list to clipboard or **Share** with others
- **Delete** individual items or clear all checked items

---

## Key Features

✅ **AI-Powered Image Recognition** — Gemini Vision API detects ingredients from photos  
✅ **Smart Recipe Generation** — AI creates recipes based on what you have  
✅ **Weekly Meal Planning** — Optimizes ingredient reuse across 7 days  
✅ **Auto Shopping List** — Collects all missing ingredients in one place  
✅ **Persistent Storage** — All data saved to browser localStorage  
✅ **No Backend Required** — Fully client-side, works offline after first load  

---

## API Key

The app uses **Google Gemini API** (already configured):
- API Key: `AIzaSyCyVVQSFym0xFIn_WLOOwp4sjs7oMTB5ao`
- Model: `gemini-1.5-flash`
- Located in: `src/app/services/ai.ts`

⚠️ **Security Note**: For production, move this key to environment variables:
```bash
# Create .env.local
VITE_GEMINI_API_KEY=your_key_here
```

Then update `src/app/services/ai.ts`:
```typescript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── HomePage.tsx              # Home page with mode selection
│   │   ├── ScanPage.tsx              # Image upload & ingredient detection
│   │   ├── RecipesPage.tsx           # AI recipe suggestions
│   │   ├── WeeklyPlanPage.tsx        # 7-day meal plan
│   │   ├── ShoppingListPage.tsx      # Shopping list manager
│   │   ├── Layout.tsx                # Main layout wrapper
│   │   ├── Header.tsx                # Navigation header
│   │   ├── mock-data.ts              # Fallback mock data
│   │   └── ui/                       # Shadcn UI components
│   ├── services/
│   │   ├── ai.ts                     # Gemini API integration
│   │   └── db.ts                     # localStorage database
│   ├── App.tsx                       # Root component
│   ├── routes.ts                     # React Router config
│   └── styles/                       # CSS & Tailwind
├── main.tsx                          # Entry point
├── index.html                        # HTML template
├── vite.config.ts                    # Vite config
├── tailwind.config.ts                # Tailwind CSS config
└── package.json                      # Dependencies
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Image Upload Not Working
- Check browser console for errors (F12 → Console)
- Ensure image is JPG, PNG, or WEBP
- Try a clearer photo with visible food items

### AI Not Generating Recipes
- Check internet connection
- Verify API key is valid
- Check browser console for API errors
- Try with different ingredients

### Data Not Persisting
- Check if localStorage is enabled in browser
- Clear browser cache and try again
- Check DevTools → Application → Local Storage

---

## Environment Variables (Optional)

Create `.env.local` in project root:
```
VITE_GEMINI_API_KEY=your_api_key_here
VITE_GEMINI_MODEL=gemini-1.5-flash
```

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Tips

- **First load**: ~2-3 seconds (downloads dependencies)
- **Image upload**: ~3-5 seconds (AI processing)
- **Recipe generation**: ~5-10 seconds (AI inference)
- **Weekly plan**: ~10-15 seconds (more complex AI task)

Results are cached in localStorage for instant reload.

---

## Support & Issues

For issues or questions:
1. Check browser console (F12 → Console tab)
2. Verify API key is valid
3. Try clearing localStorage: `localStorage.clear()` in console
4. Restart dev server: `npm run dev`

---

**Happy cooking! 🍳**
