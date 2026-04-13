import { View } from "react-native";
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

export function SubscriptionScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Subscription">) {
  const { state, setSubscriptionType } = useAppFlow();

  return (
    <ScreenShell scroll withPaddingBottom={false}>
      <View style={{ flex: 1, paddingBottom: 20 }}>
        <HeroHeader
          title="اختر الاشتراك"
          subtitle="اختر اشتراكاً مجانياً أو مدفوعاً قبل اختيار المنزل أو المطعم."
          backLabel="رجوع"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.splitColumn}>
          <ChoiceCard
            title="مجاني"
            subtitle="وصول أساسي للتطبيق مع تتبع الشاحنة ومعاينة النقاط."
            icon="gift-outline"
            selected={state.subscriptionType === "Free"}
            onPress={() => setSubscriptionType("Free")}
          />
          <ChoiceCard
            title="مدفوع"
            subtitle="خطة استلام مميزة مع إجراءات الدفع قبل دخول التطبيق."
            icon="card-outline"
            selected={state.subscriptionType === "Paid"}
            onPress={() => setSubscriptionType("Paid")}
          />
        </View>
        <View
          style={{
            marginTop: "auto",
          }}
        >
          <PrimaryButton
            label="التالي: اختر نوع الحساب"
            onPress={() => navigation.navigate("AccountType")}
          />
        </View>
      </View>
    </ScreenShell>
  );
}
