import { Ionicons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Text, Pressable, View } from "react-native";

import { UserTabParamList } from "../../navigation/AppNavigator";
import { useAppFlow } from "./context";
import { styles } from "./styles";
import { HeroHeader, ScreenShell } from "./ui";

type Props = BottomTabScreenProps<UserTabParamList, "Signal">;

export function SignalTrashScreen({ navigation }: Props) {
  const rootNavigation = useNavigation<any>();
  const { state, resetApp } = useAppFlow();

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="النفايات المُبلغ عنها"
        subtitle="شاهد جميع طلبات النفايات وحالاتها، ثم أضف طلباً جديداً عند الحاجة."
        actionLabel="تسجيل الخروج"
      />

      <Pressable
        style={styles.floatingAddButton}
        onPress={() =>
          navigation.getParent()?.navigate("RequestDetails" as never)
        }
      >
        <Ionicons name="add-circle" size={20} color="white" />
        <Text style={styles.floatingAddButtonText}>إضافة إشارة نفايات</Text>
      </Pressable>

      <View style={styles.listColumn}>
        {state.signals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              لا توجد نفايات مُبلغ عنها بعد. اضغط على إضافة لإنشاء أول طلب.
            </Text>
          </View>
        ) : (
          state.signals.map((signal) => (
            <Pressable
              key={signal.id}
              style={styles.signalCard}
              onPress={() =>
                rootNavigation.navigate("UserTrashDetails", {
                  signalId: signal.id,
                })
              }
            >
              <View style={styles.signalTopRow}>
                <View>
                  <Text style={styles.signalId}>{signal.id}</Text>
                  <Text style={styles.signalMeta}>{signal.createdAt}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    signal.status === "Waiting" && styles.statusWaiting,
                    signal.status === "On the way" && styles.statusOnWay,
                    signal.status === "Arrived" && styles.statusArrived,
                    signal.status === "Picked" && styles.statusPicked,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {signal.status === "Arrived"
                      ? "وصل"
                      : signal.status === "Picked"
                        ? "تم الاستلام"
                        : signal.status === "Waiting"
                          ? "قيد الانتظار"
                          : "في الطريق"}
                  </Text>
                </View>
              </View>

              <Text style={styles.signalText}>
                المحتوى: {signal.wasteTypes.join(", ")}
              </Text>
              <Text style={styles.signalText}>ملاحظة: {signal.note}</Text>
              <Text style={styles.signalText}>الموقع: {signal.address}</Text>
            </Pressable>
          ))
        )}
      </View>
    </ScreenShell>
  );
}
