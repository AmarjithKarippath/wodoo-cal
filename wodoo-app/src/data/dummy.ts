export type DayItem = {
  day: string;
  date: number;
  active?: boolean;
};

export type MealItem = {
  id: string;
  meal: string;
  title: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  healthScore: number;
  image: number;
  servings: number;
};

export const profile = {
  name: "Alex",
  caloriesGoal: 2200,
  caloriesLeft: 1512,
  proteinGrams: 124,
  carbsGrams: 159,
  fatGrams: 48,
};

export const calendarDays: DayItem[] = [
  { day: "Tue", date: 17 },
  { day: "Wed", date: 18 },
  { day: "Thu", date: 19 },
  { day: "Fri", date: 20, active: true },
  { day: "Sat", date: 21 },
  { day: "Sun", date: 22 },
  { day: "Mon", date: 23 },
];

export const scanModes = [
  {
    id: "scan",
    label: "Scan food",
    icon: "restaurant-outline" as const,
    active: true,
  },
  { id: "barcode", label: "Barcode", icon: "barcode-outline" as const },
  { id: "label", label: "Food label", icon: "pricetag-outline" as const },
  { id: "library", label: "Library", icon: "images-outline" as const },
];

export const sampleMeal: MealItem = {
  id: "1",
  meal: "Breakfast",
  title: "Pancakes with blueberries & syrup",
  calories: 615,
  carbs: 93,
  protein: 18,
  fat: 22,
  healthScore: 70,
  image: require("../../assets/images/food-nutrition.jpg"),
  servings: 1,
};

export const recentMeals: MealItem[] = [
  sampleMeal,
  {
    id: "2",
    meal: "Lunch",
    title: "Grilled steak with herbs",
    calories: 540,
    carbs: 8,
    protein: 48,
    fat: 34,
    healthScore: 78,
    image: require("../../assets/images/food-scan.jpg"),
    servings: 1,
  },
];
