import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

const TABS = [
  { name: "Home", label: "Home", icon: "home-outline" as const },
  { name: "Plan", label: "Plan", icon: "calendar-outline" as const },
  { name: "Scanner", label: "Scan", icon: "scan-outline" as const, center: true },
  { name: "Analysis", label: "Analysis", icon: "stats-chart-outline" as const },
  { name: "Settings", label: "Settings", icon: "settings-outline" as const },
];

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
          const focused = state.index === routeIndex;

          if (tab.center) {
            return (
              <Pressable
                key={tab.name}
                style={styles.centerSlot}
                onPress={() => navigation.navigate("Scanner")}
              >
                <View style={styles.centerButton}>
                  <Ionicons name="scan" size={26} color={colors.white} />
                </View>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.name}
              style={styles.item}
              onPress={() => navigation.navigate(tab.name)}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={focused ? colors.white : "rgba(255,255,255,0.55)"}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
  },
  bar: {
    backgroundColor: colors.darkBar,
    borderRadius: 28,
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 10,
  },
  label: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 10,
    fontWeight: "600",
  },
  labelActive: {
    color: colors.white,
  },
  centerSlot: {
    width: 72,
    alignItems: "center",
    marginTop: -28,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
