# Wodoo Expo Mockup

Interactive Expo mockup of the Wodoo calorie tracker UI with dummy data.

## Screens

- **Home** — calories left, macros, calendar, recent meals
- **Scanner** — camera-style scan UI with mode chips
- **Nutrition** — meal details, health score, servings stepper
- Plan / Analysis / Settings placeholders

## Run

Uses **Expo SDK 54** (compatible with App Store Expo Go).

```bash
cd wodoo-app
npm start
```

Then press `i` for iOS simulator, `a` for Android, or scan the QR code with Expo Go.

If you still see an SDK mismatch, update Expo Go from the App Store, or confirm Expo Go Settings shows SDK 54 support.

## Demo flow

1. Open **Home** to see daily progress
2. Tap the orange **Scan** button
3. Allow camera permission
4. Point at food and tap the shutter (or use **Library** / **Barcode**)
5. Review Nutrition results (uses your captured photo)
6. Adjust servings and tap **Done**

### Optional real AI analysis

Add to `.env` / Expo env:

```bash
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
```

Without a key, scans still use the live camera and return estimated nutrition for the demo.
