import { useAppFlow } from "@/screens/interaction/context";
import { colors, radius } from "@/theme";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Pressable, Text } from "react-native";

export const LogoutButton = () => {
  const navigation = useNavigation<any>();
  const { resetApp } = useAppFlow();
  return (
    <Pressable
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: radius.pill,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.line,
        height: 48,
        justifyContent: "center",
      }}
      onPress={async () => {
        await resetApp();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          }),
        );
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "800",
          color: colors.primaryDeep,
          textAlign: "right",
        }}
      >
        تسجيل الخروج
      </Text>
    </Pressable>
  );
};
