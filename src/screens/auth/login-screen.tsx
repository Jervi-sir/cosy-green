import { useState } from "react";
import { CommonActions } from "@react-navigation/native";
import { Alert, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { type RootStackParamList } from "../../navigation/AppNavigator";
import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";
import { HeroHeader, PrimaryButton, ScreenShell } from "../interaction/ui";

export function LoginScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Login">) {
  const { state, login } = useAppFlow();
  const [email, setEmail] = useState(
    state.appRole === "Truck" ? "truck@cozygreen.app" : "user@cozygreen.app",
  );
  const [password, setPassword] = useState("12345678");

  return (
    <ScreenShell scroll>
      <HeroHeader
        title={state.appRole === "Truck" ? "دخول الشاحنة" : "دخول المستخدم"}
        subtitle={
          state.appRole === "Truck"
            ? "سجّل الدخول للوصول إلى الطلبات والمسار وماسح QR."
            : "سجّل الدخول لإدارة طلبات النفايات وتتبع الشاحنة والنقاط."
        }
        backLabel="رجوع"
        onBackPress={() =>
          navigation.reset({ index: 0, routes: [{ name: "ModeSelect" }] })
        }
      />

      <View style={styles.card}>
        <Text style={styles.label}>البريد الإلكتروني</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="name@example.com"
          autoCapitalize="none"
        />
        <Text style={styles.label}>كلمة المرور</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          placeholder="كلمة المرور"
        />
      </View>

      <PrimaryButton
        label={
          state.appRole === "Truck" ? "افتح تطبيق الشاحنة" : "تسجيل الدخول"
        }
        onPress={async () => {
          try {
            const destination = await login(email, password);
            if (destination === "TruckApp" || destination === "UserApp") {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: destination }],
                }),
              );
              return;
            }

            navigation.navigate(destination);
          } catch (error) {
            Alert.alert(
              "تعذر تسجيل الدخول",
              error instanceof Error ? error.message : "حدث خطأ غير متوقع",
            );
          }
        }}
      />

      <View style={styles.card}>
        <Text style={styles.signalText}>ليس لديك حساب بعد؟</Text>
        <PrimaryButton
          label="إنشاء حساب"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </ScreenShell>
  );
}
