import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, Pressable, View } from "react-native";

import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";
import { HeroHeader, ScreenShell } from "../interaction/ui";

export function DriverConfirmedScreen() {
  const navigation = useNavigation<any>();
  const { state, refreshData, selectTruckSignal } = useAppFlow();
  const [refreshing, setRefreshing] = useState(false);
  const confirmedSignals = state.signals.filter(
    (signal) => signal.acceptedByTruck || signal.status === "Picked",
  );

  return (
    <ScreenShell
      scroll
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        refreshData().finally(() => setRefreshing(false));
      }}
    >
      <HeroHeader
        title="النفايات المؤكدة"
        subtitle="تم تأكيد استلام النفايات من قبل هذه الشاحنة."
        actionIcon="camera-outline"
        onActionPress={() => navigation.navigate("TruckQrScanner")}
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
                selectTruckSignal(signal.backendId);
                navigation.navigate(
                  "TruckTrashDetails",
                  {
                    signalId: signal.backendId,
                  },
                );
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
              {signal.status === "Arrived" ? (
                <Pressable
                  style={[styles.primaryButton, { marginTop: 8 }]}
                  onPress={() => navigation.navigate("TruckQrScanner")}
                >
                  <Text style={styles.primaryButtonText}>
                    فتح الكاميرا لمسح QR
                  </Text>
                </Pressable>
              ) : null}
            </Pressable>
          ))
        )}
      </View>
    </ScreenShell>
  );
}
