import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { AppButton, SocialIconButton } from "../components/ui/AppButton";
import { AppTextField, InputBadge } from "../components/ui/AppTextField";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors, radius, shadow } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.shape, styles.leftAqua]} />
        <View style={[styles.shape, styles.rightBlue]} />

        <View style={styles.logoArea}>
          <View style={styles.truckWrap}>
            <MaterialCommunityIcons
              name="truck-fast"
              size={110}
              color="#17B63F"
            />
            <View style={styles.recycleBadge}>
              <MaterialCommunityIcons
                name="recycle"
                size={28}
                color={colors.white}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Log In</Text>

          <AppTextField
            placeholder="الولاية"
            leading={<InputBadge label="🇩🇿" />}
            rtl
          />

          <AppTextField placeholder="Enter Phone Number" keyboardType="phone-pad" />

          <AppButton label="NEXT" onPress={() => navigation.replace("MainTabs")} />

          <Pressable>
            <Text style={styles.linkText}>LOGN WITH EMAIL</Text>
          </Pressable>

          <Text style={styles.subtleText}>Or Sign In with</Text>

          <View style={styles.socialRow}>
            {["facebook", "google", "instagram"].map((icon) => (
              <SocialIconButton key={icon}>
                <MaterialCommunityIcons
                  name={icon as never}
                  size={24}
                  color={colors.white}
                />
              </SocialIconButton>
            ))}
          </View>
        </View>

        <AppButton
          label="SIGNUP"
          variant="outline"
          onPress={() => navigation.navigate("Register")}
        />
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
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 36,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  shape: {
    position: "absolute",
    width: 122,
    height: 210,
    top: 358,
  },
  leftAqua: {
    left: -52,
    backgroundColor: "#16E3D8",
    transform: [{ skewY: "-40deg" }],
  },
  rightBlue: {
    right: -56,
    backgroundColor: "#79D7F8",
    transform: [{ skewY: "40deg" }],
  },
  logoArea: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  truckWrap: {
    width: 150,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  recycleBadge: {
    position: "absolute",
    top: 28,
    left: 42,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#15983A",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    marginTop: -4,
    fontSize: 26,
    color: "#3A8A42",
    fontStyle: "italic",
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: "#EDF0F1",
    ...shadow.card,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "900",
    color: "#32347C",
    marginBottom: 28,
  },
  linkText: {
    textAlign: "center",
    color: "#163C52",
    fontSize: 16,
    letterSpacing: 0.8,
  },
  subtleText: {
    textAlign: "center",
    color: "#A7A7A7",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
  },
});
