import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { type RootStackParamList } from "../../navigation/AppNavigator";
import { useAppFlow } from "./context";
import { styles } from "./styles";
import { DetailRow, HeroHeader, PrimaryButton, ScreenShell } from "./ui";

export function PaymentScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Payment">) {
  const { state } = useAppFlow();

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="الدفع عبر الإنترنت"
        subtitle="هذه صفحة دفع تجريبية قبل دخول التطبيق."
        backLabel="رجوع"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.card}>
        <DetailRow label="الاشتراك" value={state.subscriptionType} />
        <DetailRow
          label="الخطة"
          value={`${state.venueType === "House" ? "منزل" : "مطعم"} - صلاحية الاستلام`}
        />
        <DetailRow
          label="الرسوم الشهرية"
          value={state.venueType === "House" ? "100 DA" : "600 DA"}
        />
        <DetailRow label="الحالة" value="دفع تجريبي فقط" />
        <View style={styles.fakeCardBox}>
          <Text style={styles.fakeCardTitle}>بطاقة تنتهي بـ 4242</Text>
          <Text style={styles.fakeCardText}>
            اضغط على الزر أدناه لمحاكاة الدفع عبر الإنترنت.
          </Text>
        </View>
        <PrimaryButton
          label="ادفع وادخل التطبيق"
          onPress={() => navigation.replace("UserApp")}
        />
      </View>
    </ScreenShell>
  );
}
