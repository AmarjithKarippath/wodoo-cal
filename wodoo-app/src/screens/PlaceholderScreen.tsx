import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

type Props = {
  title: string;
  subtitle: string;
};

export function PlaceholderScreen({ title, subtitle }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Mock screen with dummy data — feature coming soon in the real Wodoo
          app.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.inkSoft,
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
  },
  cardText: {
    color: colors.inkSoft,
    lineHeight: 22,
  },
});
