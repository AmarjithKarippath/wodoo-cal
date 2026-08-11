import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { recentMeals, sampleMeal } from "../data/dummy";
import { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";

export function NutritionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "Nutrition">>();

  const meal = useMemo(() => {
    if (route.params?.scannedMeal) {
      const scanned = route.params.scannedMeal;
      return {
        meal: scanned.meal,
        title: scanned.title,
        calories: scanned.calories,
        carbs: scanned.carbs,
        protein: scanned.protein,
        fat: scanned.fat,
        healthScore: scanned.healthScore,
        servings: scanned.servings,
        imageSource: scanned.photoUri
          ? { uri: scanned.photoUri }
          : require("../../assets/images/food-nutrition.jpg"),
        badge: scanned.source === "ai" ? "AI scan" : "Scanned",
      };
    }

    const fromList =
      recentMeals.find((m) => m.id === route.params?.mealId) || sampleMeal;

    return {
      meal: fromList.meal,
      title: fromList.title,
      calories: fromList.calories,
      carbs: fromList.carbs,
      protein: fromList.protein,
      fat: fromList.fat,
      healthScore: fromList.healthScore,
      servings: fromList.servings,
      imageSource: fromList.image,
      badge: fromList.meal,
    };
  }, [route.params?.mealId, route.params?.scannedMeal]);

  const [servings, setServings] = useState(meal.servings);

  return (
    <View style={styles.screen}>
      <Image source={meal.imageSource} style={styles.hero} contentFit="cover" />
      <View style={[styles.heroTop, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </Pressable>
        <Text style={styles.heroTitle}>Nutrition</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.white} />
        </Pressable>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{meal.badge}</Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>{meal.title}</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setServings((s) => Math.max(1, s - 1))}
            >
              <Text style={styles.stepText}>−</Text>
            </Pressable>
            <Text style={styles.stepValue}>{servings}</Text>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setServings((s) => s + 1)}
            >
              <Text style={styles.stepText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.healthCard}>
          <View style={styles.healthTop}>
            <View style={styles.healthLabelRow}>
              <Ionicons name="flash" size={14} color={colors.white} />
              <Text style={styles.healthLabel}>Health score</Text>
            </View>
            <Text style={styles.healthValue}>{meal.healthScore}%</Text>
          </View>
          <View style={styles.healthTrack}>
            <View
              style={[styles.healthFill, { width: `${meal.healthScore}%` }]}
            />
          </View>
        </View>

        <View style={styles.macros}>
          <View style={[styles.macroCard, { backgroundColor: colors.purple }]}>
            <View style={styles.macroTop}>
              <Text style={styles.macroLabel}>Calories</Text>
              <Ionicons name="pencil" size={14} color={colors.ink} />
            </View>
            <Text style={styles.macroValue}>{meal.calories * servings}</Text>
            <Text style={styles.macroUnit}>kcal</Text>
          </View>
          <View style={[styles.macroCard, { backgroundColor: colors.yellow }]}>
            <View style={styles.macroTop}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Ionicons name="pencil" size={14} color={colors.ink} />
            </View>
            <Text style={styles.macroValue}>{meal.carbs * servings}</Text>
            <Text style={styles.macroUnit}>gram</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.fixBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.fixText}>Fix results</Text>
          </Pressable>
          <Pressable
            style={styles.doneBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    width: "100%",
    height: "42%",
  },
  heroTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    flex: 1,
    marginTop: -28,
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#EEECEA",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  tagText: {
    color: colors.inkSoft,
    fontWeight: "700",
    fontSize: 12,
  },
  titleRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 18,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    color: colors.ink,
    lineHeight: 30,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F0EC",
    borderRadius: 16,
    padding: 4,
    gap: 8,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
  },
  stepValue: {
    minWidth: 16,
    textAlign: "center",
    fontWeight: "800",
    color: colors.ink,
  },
  healthCard: {
    backgroundColor: colors.darkBar,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  healthTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  healthLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  healthLabel: {
    color: colors.white,
    fontWeight: "700",
  },
  healthValue: {
    color: colors.white,
    fontWeight: "800",
  },
  healthTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  healthFill: {
    height: "100%",
    backgroundColor: colors.lime,
    borderRadius: 999,
  },
  macros: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  macroCard: {
    flex: 1,
    borderRadius: 22,
    padding: 16,
    minHeight: 120,
  },
  macroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  macroLabel: {
    fontWeight: "700",
    color: colors.ink,
  },
  macroValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink,
  },
  macroUnit: {
    color: colors.inkSoft,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
  },
  fixBtn: {
    flex: 1,
    backgroundColor: "#F1EFEC",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  fixText: {
    fontWeight: "700",
    color: colors.ink,
  },
  doneBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  doneText: {
    fontWeight: "800",
    color: colors.white,
  },
});
