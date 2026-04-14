import { useState } from "react";
import { CommonActions } from "@react-navigation/native";
import { Alert, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "@/navigation/AppNavigator";
import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";
import { HeroHeader, PrimaryButton, ScreenShell } from "../interaction/ui";

export function RegisterScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Register">) {
  const { state, register } = useAppFlow();
  const isTruck = state.appRole === "Truck";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [truckName, setTruckName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [zone, setZone] = useState("");

  return (
    <ScreenShell scroll>
      <HeroHeader
        title={isTruck ? "تسجيل شاحنة جديدة" : "إنشاء حساب مستخدم"}
        subtitle={
          isTruck
            ? "أنشئ حساب الشاحنة مع بيانات المركبة للوصول إلى الطلبات والماسح."
            : "أنشئ حساب المستخدم للبدء في إرسال طلبات النفايات وتتبع الشاحنة."
        }
        backLabel="رجوع"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.card}>
        <Text style={styles.label}>الاسم</Text>
        <TextInput value={fullName} onChangeText={setFullName} style={styles.input} />
        <Text style={styles.label}>البريد الإلكتروني</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <Text style={styles.label}>كلمة المرور</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        {isTruck ? (
          <>
            <Text style={styles.label}>اسم الشاحنة</Text>
            <TextInput value={truckName} onChangeText={setTruckName} style={styles.input} />
            <Text style={styles.label}>رقم اللوحة</Text>
            <TextInput value={plateNumber} onChangeText={setPlateNumber} style={styles.input} />
            <Text style={styles.label}>المنطقة</Text>
            <TextInput value={zone} onChangeText={setZone} style={styles.input} />
          </>
        ) : null}
      </View>

      <PrimaryButton
        label={isTruck ? "إنشاء حساب الشاحنة" : "إنشاء الحساب"}
        onPress={async () => {
          try {
            const destination = await register({
              fullName,
              email,
              password,
              truckName,
              plateNumber,
              zone,
            });

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
              "تعذر إنشاء الحساب",
              error instanceof Error ? error.message : "حدث خطأ غير متوقع",
            );
          }
        }}
      />

      <View style={styles.card}>
        <Text style={styles.signalText}>لديك حساب بالفعل؟</Text>
        <PrimaryButton label="تسجيل الدخول" onPress={() => navigation.navigate("Login")} />
      </View>
    </ScreenShell>
  );
}
