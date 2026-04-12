import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { RootStackParamList } from "@/navigation/AppNavigator";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export function BootScreen({ navigation }: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace("Login");
    }, 1600);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.glowDiamond} />
        <View style={styles.bottomLeftCircle} />
        <View style={styles.bottomRightCircle} />

        <View style={styles.heroBlock}>
          <View style={styles.logoWrap}>
            <View style={styles.speedLines}>
              <View style={[styles.speedLine, styles.speedLineShort]} />
              <View style={styles.speedLine} />
              <View style={[styles.speedLine, styles.speedLineLong]} />
            </View>

            <MaterialCommunityIcons
              name="truck-fast"
              size={132}
              color="#16B63C"
              style={styles.truckIcon}
            />

            <View style={styles.recycleBadge}>
              <MaterialCommunityIcons
                name="recycle"
                size={34}
                color={colors.white}
              />
            </View>

            <View style={styles.frontSeparatorA} />
            <View style={styles.frontSeparatorB} />

            <View style={styles.wheelOuter}>
              <View style={styles.wheelInner} />
            </View>
          </View>

          <Text style={styles.brand}>إيزي جرين</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  glowDiamond: {
    position: "absolute",
    width: 278,
    height: 278,
    backgroundColor: "rgba(194, 255, 197, 0.58)",
    borderRadius: 22,
    transform: [{ rotate: "-38deg" }],
    bottom: 108,
    left: -78,
    shadowColor: "#C9FFD3",
    shadowOpacity: 1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  bottomLeftCircle: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#9DEBBE",
    bottom: -8,
    left: -28,
  },
  bottomRightCircle: {
    position: "absolute",
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "#27D18F",
    bottom: 64,
    right: -24,
  },
  heroBlock: {
    alignItems: "center",
    marginBottom: 50,
  },
  logoWrap: {
    width: 224,
    height: 166,
    alignItems: "center",
    justifyContent: "center",
  },
  speedLines: {
    position: "absolute",
    left: 26,
    top: 74,
    gap: 9,
  },
  speedLine: {
    height: 5,
    width: 54,
    borderRadius: 999,
    backgroundColor: "#18B63D",
  },
  speedLineShort: {
    width: 38,
  },
  speedLineLong: {
    width: 60,
  },
  truckIcon: {
    marginTop: 8,
  },
  recycleBadge: {
    position: "absolute",
    left: 78,
    top: 32,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#0F9334",
    alignItems: "center",
    justifyContent: "center",
  },
  frontSeparatorA: {
    position: "absolute",
    right: 64,
    top: 54,
    width: 6,
    height: 70,
    borderRadius: 999,
    backgroundColor: colors.white,
    transform: [{ rotate: "16deg" }],
  },
  frontSeparatorB: {
    position: "absolute",
    right: 54,
    top: 55,
    width: 4,
    height: 68,
    borderRadius: 999,
    backgroundColor: colors.white,
    transform: [{ rotate: "16deg" }],
  },
  wheelOuter: {
    position: "absolute",
    left: 62,
    bottom: 26,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2A0F1D",
    alignItems: "center",
    justifyContent: "center",
  },
  wheelInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F3E5E5",
  },
  brand: {
    marginTop: -10,
    color: "#5E7B60",
    fontSize: 26,
    fontStyle: "italic",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
