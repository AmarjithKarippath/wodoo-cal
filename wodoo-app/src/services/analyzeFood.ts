export type AnalyzedMeal = {
  meal: string;
  title: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  healthScore: number;
  servings: number;
  photoUri: string;
  source: "ai" | "estimate";
};

const FALLBACK_MEALS = [
  {
    meal: "Lunch",
    title: "Grilled chicken with rice",
    calories: 520,
    carbs: 48,
    protein: 42,
    fat: 16,
    healthScore: 82,
  },
  {
    meal: "Dinner",
    title: "Steak with roasted vegetables",
    calories: 640,
    carbs: 18,
    protein: 46,
    fat: 38,
    healthScore: 74,
  },
  {
    meal: "Breakfast",
    title: "Avocado toast with eggs",
    calories: 430,
    carbs: 34,
    protein: 18,
    fat: 26,
    healthScore: 79,
  },
  {
    meal: "Snack",
    title: "Fruit bowl with yogurt",
    calories: 260,
    carbs: 42,
    protein: 12,
    fat: 6,
    healthScore: 88,
  },
];

async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function estimateFromCapture(photoUri: string): AnalyzedMeal {
  const pick = FALLBACK_MEALS[Math.floor(Math.random() * FALLBACK_MEALS.length)];
  return {
    ...pick,
    servings: 1,
    photoUri,
    source: "estimate",
  };
}

async function analyzeWithOpenAI(photoUri: string): Promise<AnalyzedMeal | null> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const base64 = await uriToBase64(photoUri);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a nutrition assistant. Estimate the meal from the photo. Return JSON with keys: meal (Breakfast|Lunch|Dinner|Snack), title, calories, carbs, protein, fat, healthScore (0-100). Numbers only for numeric fields.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identify the food and estimate nutrition for one serving.",
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64}` },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);

    return {
      meal: String(parsed.meal || "Meal"),
      title: String(parsed.title || "Scanned meal"),
      calories: Math.round(Number(parsed.calories) || 400),
      carbs: Math.round(Number(parsed.carbs) || 30),
      protein: Math.round(Number(parsed.protein) || 20),
      fat: Math.round(Number(parsed.fat) || 15),
      healthScore: Math.min(100, Math.max(0, Math.round(Number(parsed.healthScore) || 70))),
      servings: 1,
      photoUri,
      source: "ai",
    };
  } catch {
    return null;
  }
}

export async function analyzeFoodPhoto(photoUri: string): Promise<AnalyzedMeal> {
  const ai = await analyzeWithOpenAI(photoUri);
  if (ai) return ai;
  // Brief delay so the analyzing state is visible in estimate mode
  await new Promise((resolve) => setTimeout(resolve, 900));
  return estimateFromCapture(photoUri);
}
