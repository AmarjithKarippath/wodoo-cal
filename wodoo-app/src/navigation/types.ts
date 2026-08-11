import type { AnalyzedMeal } from "../services/analyzeFood";

export type RootStackParamList = {
  Tabs: undefined;
  Nutrition: {
    mealId?: string;
    scannedMeal?: AnalyzedMeal;
  };
};

export type TabParamList = {
  Home: undefined;
  Plan: undefined;
  Scanner: undefined;
  Analysis: undefined;
  Settings: undefined;
};
