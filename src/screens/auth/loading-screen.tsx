import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { type RootStackParamList } from "../../navigation/AppNavigator";
import { colors } from "../../theme";
import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";

export function LoadingScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Loading">) {
  const { bootstrap } = useAppFlow();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const [result] = await Promise.all([
        bootstrap(),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
      if (!cancelled && result) {
        navigation.replace(result);
      }
    };

    run().catch(() => navigation.replace("Login"));

    return () => {
      cancelled = true;
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.loadingScreen}>
      <View style={styles.loadingBadge}>
        <MaterialCommunityIcons name="recycle" size={42} color={colors.white} />
      </View>
      <Text style={styles.loadingTitle}>Cozy Green</Text>
      <Text style={styles.loadingText}>
        جاري تحضير تجربة الاستلام وتتبع الشاحنة والمكافآت.
      </Text>
    </SafeAreaView>
  );
}
