import { C } from "./tokens";

export interface Item {
  id: number; emoji: string; name: string; brand: string; category: string;
  qty: number; unit: string; daysLeft: number; calories: number; protein: number;
  fat: number; allergens: string[]; added: string;
}

export interface Recipe {
  id: number; emoji: string; name: string; time: string; servings: number;
  rating: number; meal: string; ingredients: string[]; steps: string[];
}

export const ITEMS: Item[] = [
  { id: 1, emoji: "🥛", name: "Whole Milk", brand: "Organic Valley", category: "Dairy", qty: 1, unit: "gal", daysLeft: 1, calories: 150, protein: 8, fat: 8, allergens: ["Milk"], added: "Jun 3" },
  { id: 2, emoji: "🫙", name: "Greek Yogurt", brand: "Chobani", category: "Dairy", qty: 2, unit: "cups", daysLeft: 3, calories: 100, protein: 17, fat: 0, allergens: ["Milk"], added: "Jun 5" },
  { id: 3, emoji: "🍞", name: "Sourdough Bread", brand: "Acme", category: "Bakery", qty: 1, unit: "loaf", daysLeft: 2, calories: 120, protein: 4, fat: 1, allergens: ["Gluten", "Wheat"], added: "Jun 4" },
  { id: 4, emoji: "🍓", name: "Strawberries", brand: "Local Farm", category: "Produce", qty: 1, unit: "pint", daysLeft: 4, calories: 50, protein: 1, fat: 0, allergens: [], added: "Jun 5" },
  { id: 5, emoji: "🥬", name: "Baby Spinach", brand: "Earthbound", category: "Produce", qty: 1, unit: "bag", daysLeft: 5, calories: 20, protein: 2, fat: 0, allergens: [], added: "Jun 2" },
  { id: 6, emoji: "🧀", name: "Cheddar Cheese", brand: "Tillamook", category: "Dairy", qty: 1, unit: "block", daysLeft: 14, calories: 110, protein: 7, fat: 9, allergens: ["Milk"], added: "May 30" },
  { id: 7, emoji: "🍊", name: "Orange Juice", brand: "Tropicana", category: "Beverages", qty: 1, unit: "carton", daysLeft: 7, calories: 110, protein: 2, fat: 0, allergens: [], added: "Jun 1" },
  { id: 8, emoji: "🍗", name: "Chicken Breast", brand: "Perdue", category: "Meat", qty: 2, unit: "lbs", daysLeft: 1, calories: 165, protein: 31, fat: 4, allergens: [], added: "Jun 6" },
  { id: 9, emoji: "🥚", name: "Brown Eggs", brand: "Happy Egg", category: "Dairy", qty: 12, unit: "ct", daysLeft: 18, calories: 70, protein: 6, fat: 5, allergens: ["Eggs"], added: "May 28" },
  { id: 10, emoji: "🥕", name: "Baby Carrots", brand: "Bolthouse", category: "Produce", qty: 1, unit: "bag", daysLeft: 10, calories: 35, protein: 1, fat: 0, allergens: [], added: "Jun 1" },
  { id: 11, emoji: "🍅", name: "Pasta Sauce", brand: "Rao's", category: "Pantry", qty: 1, unit: "jar", daysLeft: 90, calories: 80, protein: 2, fat: 5, allergens: [], added: "May 15" },
  { id: 12, emoji: "🥤", name: "Almond Milk", brand: "Califia", category: "Beverages", qty: 1, unit: "carton", daysLeft: 9, calories: 40, protein: 1, fat: 3, allergens: ["Tree Nuts"], added: "Jun 3" },
];

export const RECIPES: Recipe[] = [
  { id: 1, emoji: "🍳", name: "Spinach Omelette", time: "15 min", servings: 2, rating: 4.8, meal: "Breakfast", ingredients: ["Baby Spinach", "Brown Eggs", "Cheddar Cheese"], steps: ["Whisk 3 eggs with salt and pepper", "Sauté spinach 2 min until wilted", "Pour eggs over spinach, cook until set", "Add cheese, fold and serve warm"] },
  { id: 2, emoji: "🍓", name: "Strawberry Yogurt Bowl", time: "5 min", servings: 1, rating: 4.5, meal: "Breakfast", ingredients: ["Strawberries", "Greek Yogurt"], steps: ["Spoon yogurt into a wide bowl", "Slice strawberries and fan over top", "Drizzle with honey if desired", "Finish with granola for crunch"] },
  { id: 3, emoji: "🥘", name: "Chicken Veggie Stir Fry", time: "30 min", servings: 4, rating: 4.9, meal: "Dinner", ingredients: ["Chicken Breast", "Baby Carrots", "Baby Spinach"], steps: ["Slice chicken thin, season generously", "Heat wok on high until smoking", "Cook chicken 6–8 min until golden", "Add carrots 3 min, spinach 1 min, serve"] },
  { id: 4, emoji: "🍞", name: "French Toast", time: "20 min", servings: 2, rating: 4.7, meal: "Breakfast", ingredients: ["Sourdough Bread", "Brown Eggs", "Whole Milk"], steps: ["Whisk eggs and milk with cinnamon", "Soak each bread slice 30 seconds", "Cook on buttered skillet 3 min per side", "Serve with maple syrup and fresh fruit"] },
  { id: 5, emoji: "🥗", name: "Simple Green Salad", time: "10 min", servings: 2, rating: 4.3, meal: "Lunch", ingredients: ["Baby Spinach", "Baby Carrots"], steps: ["Wash and dry spinach", "Shave carrots thin with a peeler", "Toss with olive oil and lemon", "Season to taste and serve immediately"] },
];

export const ALL_ALLERGENS = ["Peanuts", "Tree Nuts", "Milk", "Eggs", "Soy", "Wheat", "Gluten", "Fish", "Shellfish", "Sesame"];
export const HEALTH_CONDITIONS = ["Diabetes", "Hypertension", "Gluten Sensitivity", "Lactose Intolerance", "Kidney Disease", "Heart Disease"];
export const DIETARY_PREFS = ["Vegetarian", "Vegan", "Keto", "Paleo", "Gluten-Free", "Dairy-Free"];
export const CATEGORIES = ["All", "Dairy", "Produce", "Meat", "Bakery", "Beverages", "Pantry"];
export const MEAL_FILTERS = ["All", "Breakfast", "Lunch", "Dinner"];

// Helpers — mirror the template exactly
export const urgency = (d: number): "error" | "warning" | "success" =>
  d <= 2 ? "error" : d <= 5 ? "warning" : "success";
export const urgencyLabel = (d: number): string =>
  d === 0 ? "Expires Today!" : d === 1 ? "Tomorrow" : `${d} days`;
export const urgencyColor = (d: number): string =>
  ({ error: C.error, warning: C.warning, success: C.success }[urgency(d)]);
export const urgencyBg = (d: number): string =>
  ({ error: C.errorSoft, warning: C.warningSoft, success: C.successSoft }[urgency(d)]);
export const urgencyIcon = (d: number): string =>
  ({ error: "🚨", warning: "⚠️", success: "✅" }[urgency(d)]);

export const DAILY_TIPS = [
  { icon: "🥛", tip: "Use expiring Whole Milk in overnight oats — saves $3.49 and reduces waste!", category: "Waste" },
  { icon: "🌿", tip: "Store fresh herbs in a glass of water in the fridge to extend life by 2 weeks.", category: "Storage" },
  { icon: "💰", tip: "Walmart has 20% off produce today — great time to restock your veggies.", category: "Savings" },
  { icon: "♻️", tip: "You've reduced 2.4kg of waste this month — you're in the top 15% of users!", category: "Impact" },
  { icon: "🥗", tip: "Batch cook on Sundays using expiring items to save time and money all week.", category: "Meal Prep" },
];

export const SEASONAL_PRODUCE = [
  { emoji: "🍓", name: "Strawberries", note: "Peak season · Best price now", store: "$2.99/pint" },
  { emoji: "🌽", name: "Sweet Corn", note: "Local harvest · Fresh this week", store: "$0.59/ear" },
  { emoji: "🍑", name: "Peaches", note: "Summer peak · High in vitamin C", store: "$1.99/lb" },
  { emoji: "🫐", name: "Blueberries", note: "Antioxidant-rich · Buy now", store: "$3.49/pint" },
];

export const HOUSEHOLD_FEED = [
  { member: "Mom", avatar: "👩", action: "added Whole Milk", time: "2m ago", emoji: "🥛" },
  { member: "Dad", avatar: "👨", action: "used Greek Yogurt", time: "15m ago", emoji: "🫙" },
  { member: "You", avatar: "👤", action: "scanned Chicken", time: "1h ago", emoji: "🍗" },
  { member: "Sarah", avatar: "👧", action: "marked Eggs as used", time: "3h ago", emoji: "🥚" },
];
