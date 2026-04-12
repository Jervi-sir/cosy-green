import { useNavigation } from "@react-navigation/native";
import { Text, Pressable, View } from "react-native";

import { useAppFlow } from "./context";
import { styles } from "./styles";
import { HeroHeader, ScreenShell } from "./ui";

export function DriverConfirmedScreen() {
  const navigation = useNavigation<any>();
  const { state, resetApp, selectTruckSignal } = useAppFlow();
  const confirmedSignals = state.signals.filter(
    (signal) => signal.acceptedByTruck || signal.status === "Picked",
  );

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="النفايات المؤكدة"
        subtitle="تم تأكيد استلام النفايات من قبل هذه الشاحنة."
      />

      <View style={styles.listColumn}>
        {confirmedSignals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              لا توجد عمليات استلام مؤكدة بعد.
            </Text>
          </View>
        ) : (
          confirmedSignals.map((signal) => (
            <Pressable
              key={signal.id}
              style={styles.signalCard}
              onPress={() => {
                selectTruckSignal(signal.id);
                navigation.navigate("TruckTrashDetails", {
                  signalId: signal.id,
                });
              }}
            >
              <View style={styles.signalTopRow}>
                <View>
                  <Text style={styles.signalId}>{signal.id}</Text>
                  <Text style={styles.signalMeta}>
                    {signal.acceptedAt ?? signal.createdAt}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    signal.status === "Arrived" && styles.statusArrived,
                    signal.status === "Picked"
                      ? styles.statusPicked
                      : styles.statusOnWay,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {signal.status === "Arrived"
                      ? "وصل"
                      : signal.status === "Picked"
                        ? "تم الاستلام"
                        : "في الطريق"}
                  </Text>
                </View>
              </View>
              <Text style={styles.signalText}>
                النفايات: {signal.wasteTypes.join(", ")}
              </Text>
              <Text style={styles.signalText}>الموقع: {signal.address}</Text>
            </Pressable>
          ))
        )}
      </View>
    </ScreenShell>
  );
}
