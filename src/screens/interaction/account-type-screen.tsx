import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { type RootStackParamList } from "../../navigation/AppNavigator";
import { useAppFlow } from "./context";
import { styles } from "./styles";
import { ChoiceCard, HeroHeader, PrimaryButton, ScreenShell } from "./ui";

export function AccountTypeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "AccountType">) {
  const { state, setVenueType } = useAppFlow();

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="هل أنت منزل أم مطعم؟"
        subtitle="اختر الملف الشخصي الذي يطابق المكان الذي ينتج النفايات."
        backLabel="رجوع"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.splitColumn}>
        <ChoiceCard
          title="منزل"
          subtitle="جمع منزلي، أكياس أصغر، جدول منزلي عادي"
          icon="home-outline"
          selected={state.venueType === "House"}
          onPress={() => setVenueType("House")}
        />
        <ChoiceCard
          title="مطعم"
          subtitle="المزيد من نفايات الخبز والتغليف، توقعات استلام أسرع"
          icon="restaurant-outline"
          selected={state.venueType === "Restaurant"}
          onPress={() => setVenueType("Restaurant")}
        />
      </View>
      <PrimaryButton
        label={
          state.subscriptionType === "Paid"
            ? "التالي: الدفع عبر الإنترنت"
            : "دخول التطبيق بالخطة المجانية"
        }
        onPress={() =>
          navigation.navigate(
            state.subscriptionType === "Paid" ? "Payment" : "UserApp",
          )
        }
      />
    </ScreenShell>
  );
}
