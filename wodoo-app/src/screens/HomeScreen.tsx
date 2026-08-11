import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { calendarDays, profile, recentMeals } from "../data/dummy";
import { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/avatar.jpg")}
            style={styles.avatar}
          />
          <Pressable style={styles.bell}>
            <Ionicons name="notifications-outline" size={22} color={colors.ink} />
          </Pressable>
        </View>

        <View style={styles.monthRow}>
          <Text style={styles.month}>January</Text>
          <Ionicons name="chevron-down" size={16} color={colors.ink} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.days}
        >
          {calendarDays.map((item) => (
            <View
              key={item.date}
              style={[styles.dayCard, item.active && styles.dayCardActive]}
            >
              <Text style={[styles.dayLabel, item.active && styles.dayLabelActive]}>
                {item.day}
              </Text>
              <View style={[styles.dateCircle, item.active && styles.dateCircleActive]}>
                <Text style={[styles.dateText, item.active && styles.dateTextActive]}>
                  {item.date}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Image
          source={require("../../assets/images/calories-left-card.png")}
          style={styles.calorieCardImage}
          contentFit="contain"
        />

        <View style={styles.metrics}>
          <View style={[styles.metricCard, { backgroundColor: colors.purple }]}>
            <Ionicons name="flash" size={18} color={colors.ink} />
            <Text style={styles.metricValue}>{profile.proteinGrams} gram</Text>
            <Text style={styles.metricLabel}>Protein</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.green }]}>
            <Ionicons name="leaf" size={18} color={colors.ink} />
            <Text style={styles.metricValue}>{profile.carbsGrams} gram</Text>
            <Text style={styles.metricLabel}>Carbs</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent meals</Text>
        {recentMeals.map((meal) => (
          <Pressable
            key={meal.id}
            style={styles.mealRow}
            onPress={() => navigation.navigate("Nutrition", { mealId: meal.id })}
          >
            <Image source={meal.image} style={styles.mealThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.mealTag}>{meal.meal}</Text>
              <Text style={styles.mealTitle} numberOfLines={1}>
                {meal.title}
              </Text>
              <Text style={styles.mealMeta}>{meal.calories} kcal</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 130,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  month: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.ink,
  },
  days: {
    gap: 8,
    paddingBottom: 18,
  },
  dayCard: {
    width: 54,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 28,
    backgroundColor: "transparent",
    gap: 8,
  },
  dayCardActive: {
    backgroundColor: colors.accent,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.inkSoft,
    fontWeight: "600",
  },
  dayLabelActive: {
    color: colors.white,
  },
  dateCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCircleActive: {
    backgroundColor: colors.ink,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  dateTextActive: {
    color: colors.white,
  },
  calorieCardImage: {
    width: "100%",
    aspectRatio: 260 / 203,
    marginBottom: 14,
    borderRadius: 28,
  },
  metrics: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  metricCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    minHeight: 110,
    justifyContent: "space-between",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 18,
  },
  metricLabel: {
    color: colors.inkSoft,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 12,
  },
  mealRow: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  mealThumb: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  mealTag: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  mealTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "700",
  },
  mealMeta: {
    color: colors.inkSoft,
    fontSize: 13,
    marginTop: 2,
  },
});
