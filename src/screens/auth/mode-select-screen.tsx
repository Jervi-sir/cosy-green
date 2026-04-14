import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "@/navigation/AppNavigator";
import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";
import { ChoiceCard, HeroHeader, PrimaryButton, ScreenShell } from "../interaction/ui";

export function ModeSelectScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ModeSelect">) {
  const { state, setAppRole } = useAppFlow();

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="اختر نوع الحساب"
        subtitle="ابدأ بتحديد ما إذا كنت ستدخل كتطبيق مستخدم أو كتطبيق شاحنة."
      />

      <View style={styles.splitColumn}>
        <ChoiceCard
          title="تطبيق المستخدم"
          subtitle="إنشاء الطلبات، تتبع الشاحنة، عرض النقاط وإدارة النفايات الخاصة بك."
          icon="person-outline"
          selected={state.appRole === "User"}
          onPress={() => setAppRole("User")}
        />
        <ChoiceCard
          title="تطبيق الشاحنة"
          subtitle="استلام الطلبات المؤكدة، تتبع المسار، مسح QR وتسجيل الالتقاط."
          icon="bus-outline"
          selected={state.appRole === "Truck"}
          onPress={() => setAppRole("Truck")}
        />
      </View>

      <View style={styles.splitColumn}>
        <PrimaryButton
          label="تسجيل الدخول"
          onPress={() => navigation.navigate("Login")}
        />
        <PrimaryButton
          label="إنشاء حساب"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </ScreenShell>
  );
}
