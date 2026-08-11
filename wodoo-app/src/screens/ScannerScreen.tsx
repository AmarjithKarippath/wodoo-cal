import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, NavigationProp, useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scanModes } from "../data/dummy";
import { RootStackParamList } from "../navigation/types";
import { analyzeFoodPhoto } from "../services/analyzeFood";
import { colors } from "../theme/colors";

type ScanModeId = "scan" | "barcode" | "label" | "library";

export function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const cameraRef = useRef<CameraView>(null);
  const barcodeLock = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScanModeId>("scan");
  const [analyzing, setAnalyzing] = useState(false);
  const [facing, setFacing] = useState<"back" | "front">("back");

  async function openNutritionFromUri(uri: string) {
    setAnalyzing(true);
    try {
      const scannedMeal = await analyzeFoodPhoto(uri);
      navigation.navigate("Nutrition", { scannedMeal });
    } finally {
      setAnalyzing(false);
    }
  }

  async function capturePhoto() {
    if (!cameraRef.current || analyzing) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
      });
      if (photo?.uri) {
        await openNutritionFromUri(photo.uri);
      }
    } catch {
      setAnalyzing(false);
    }
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      await openNutritionFromUri(result.assets[0].uri);
    }
  }

  async function onModePress(next: ScanModeId) {
    setMode(next);
    if (next === "library") {
      await pickFromLibrary();
      setMode("scan");
    }
  }

  if (!permission) {
    return <View style={styles.screen} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionBody}>
          Allow camera access to scan food and estimate calories.
        </Text>
        <Pressable style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Enable camera</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {isFocused ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          mode="picture"
          barcodeScannerSettings={
            mode === "barcode"
              ? { barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"] }
              : undefined
          }
          onBarcodeScanned={
            mode === "barcode" && !analyzing
              ? ({ data }) => {
                  if (barcodeLock.current) return;
                  barcodeLock.current = true;
                  setAnalyzing(true);
                  setTimeout(() => {
                    navigation.navigate("Nutrition", {
                      scannedMeal: {
                        meal: "Snack",
                        title: `Packaged item (${data.slice(0, 12)})`,
                        calories: 250,
                        carbs: 30,
                        protein: 8,
                        fat: 10,
                        healthScore: 62,
                        servings: 1,
                        photoUri: "",
                        source: "estimate",
                      },
                    });
                    setAnalyzing(false);
                    setMode("scan");
                    barcodeLock.current = false;
                  }, 600);
                }
              : undefined
          }
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.ink }]} />
      )}

      <View style={styles.scrim} pointerEvents="none" />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>Scanner</Text>
        <Pressable
          style={styles.moreBtn}
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
        >
          <Ionicons name="camera-reverse-outline" size={18} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.frameWrap}>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>
        <Text style={styles.hint}>
          {mode === "barcode"
            ? "Align a barcode inside the frame"
            : mode === "label"
              ? "Point at a nutrition label"
              : "Point at your meal to analyze"}
        </Text>
      </View>

      <View style={[styles.controls, { marginBottom: 110 + insets.bottom }]}>
        <View style={styles.modes}>
          {scanModes.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.modeCard, mode === item.id && styles.modeCardActive]}
              onPress={() => onModePress(item.id as ScanModeId)}
              disabled={analyzing}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={colors.ink}
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.modeLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {(mode === "scan" || mode === "label") && (
          <Pressable
            style={[styles.shutter, analyzing && styles.shutterDisabled]}
            onPress={capturePhoto}
            disabled={analyzing}
          >
            {analyzing ? (
              <ActivityIndicator color={colors.accent} />
            ) : (
              <View style={styles.shutterInner} />
            )}
          </Pressable>
        )}
      </View>

      {analyzing ? (
        <View style={styles.analyzingOverlay}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.analyzingText}>Analyzing your meal…</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  permissionTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  permissionBody: {
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  permissionBtnText: {
    color: colors.white,
    fontWeight: "800",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  topBar: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "700",
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  frameWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: "78%",
    aspectRatio: 1,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: colors.white,
  },
  tl: {
    top: -2,
    left: -2,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 18,
  },
  tr: {
    top: -2,
    right: -2,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 18,
  },
  bl: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 18,
  },
  br: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 18,
  },
  hint: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 16,
    fontWeight: "600",
  },
  controls: {
    gap: 16,
    paddingHorizontal: 16,
  },
  modes: {
    flexDirection: "row",
    gap: 10,
  },
  modeCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    minHeight: 88,
  },
  modeCardActive: {
    backgroundColor: colors.green,
  },
  modeLabel: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  shutter: {
    alignSelf: "center",
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  shutterDisabled: {
    opacity: 0.7,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  analyzingText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
