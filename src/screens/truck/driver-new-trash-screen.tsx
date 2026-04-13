import { useNavigation } from "@react-navigation/native";
import { Text, Pressable, View } from "react-native";

import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";
import { HeroHeader, ScreenShell } from "../interaction/ui";

export function DriverNewTrashScreen() {
  const navigation = useNavigation<any>();
  const { state, resetApp, selectTruckSignal } = useAppFlow();
  const newSignals = state.signals.filter(
    (signal) => !signal.acceptedByTruck && signal.status !== "Picked",
  );

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="نفايات جديدة"
        subtitle="طلبات النفايات الواردة بانتظار مراجعة الشاحنة وتأكيدها."
      />

      <View style={styles.listColumn}>
        {newSignals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              لا توجد طلبات نفايات جديدة في الوقت الحالي.
            </Text>
          </View>
        ) : (
          newSignals.map((signal) => (
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
                  <Text style={styles.signalMeta}>{signal.createdAt}</Text>
                </View>
                <View style={[styles.statusBadge, styles.statusWaiting]}>
                  <Text style={styles.statusText}>قيد الانتظار</Text>
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
