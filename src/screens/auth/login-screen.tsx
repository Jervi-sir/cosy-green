import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { type RootStackParamList } from "../../navigation/AppNavigator";
import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";
import {
  ChoiceCard,
  HeroHeader,
  PrimaryButton,
  ScreenShell,
} from "../interaction/ui";

export function LoginScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Login">) {
  const { state, setAppRole } = useAppFlow();
  const [email, setEmail] = useState("user@cozygreen.app");
  const [password, setPassword] = useState("12345678");

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="تسجيل الدخول"
        subtitle="اختر ما إذا كان هذا الدخول سيفتح تطبيق المستخدم أو تطبيق الشاحنة."
      />
      <View style={styles.card}>
        <Text style={styles.label}>البريد الإلكتروني</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="name@example.com"
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

      <View style={styles.splitColumn}>
        <ChoiceCard
          title="تطبيق المستخدم"
          subtitle="مسار المواطن مع الاشتراك، نوع الحساب، إرسال إشارات النفايات، تتبع الشاحنات والنقاط."
          icon="person-outline"
          selected={state.appRole === "User"}
          onPress={() => setAppRole("User")}
        />
        <ChoiceCard
          title="تطبيق الشاحنة"
          subtitle="مسار السائق مع المهام المعينة، تقدم المسار وتأكيد المسح عبر رمز QR."
          icon="bus-outline"
          selected={state.appRole === "Truck"}
          onPress={() => setAppRole("Truck")}
        />
      </View>

      <PrimaryButton
        label={
          state.appRole === "Truck"
            ? "افتح تطبيق الشاحنة"
            : "متابعة إعداد المستخدم"
        }
        onPress={() =>
          navigation.navigate(
            state.appRole === "Truck" ? "TruckApp" : "Subscription",
          )
        }
      />
    </ScreenShell>
  );
}
