import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Text, View } from "react-native";

import { LogoutButton } from "@/components/LogoutButton";
import { colors } from "@/theme";
import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";
import { DetailRow, HeroHeader, PrimaryButton, ScreenShell } from "../interaction/ui";

export function TruckProfileScreen() {
  const navigation = useNavigation<any>();
  const { state, refreshData } = useAppFlow();
  const [refreshing, setRefreshing] = useState(false);
  const waitingCount = state.signals.filter(
    (signal) => signal.status === "Waiting",
  ).length;
  const onWayCount = state.signals.filter(
    (signal) => signal.status === "On the way",
  ).length;
  const arrivedCount = state.signals.filter(
    (signal) => signal.status === "Arrived",
  ).length;
  const pickedCount = state.signals.filter(
    (signal) => signal.status === "Picked",
  ).length;

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
        title="ملف الشاحنة"
        subtitle="إحصائيات سريعة عن الأداء وعدد عمليات الاستلام الحالية."
      />

      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.sectionTitle}>{state.truckProfile.name}</Text>
            <Text style={styles.signalMeta}>{state.truckProfile.zone}</Text>
          </View>
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              backgroundColor: colors.primarySoft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="truck-fast"
              size={24}
              color={colors.primaryDeep}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>إحصائيات الشاحنة</Text>
        <View style={styles.splitColumn}>
          <DetailRow
            label="رقم اللوحة"
            value={state.truckProfile.plateNumber}
          />
          <DetailRow
            label="إجمالي ما تم جمعه"
            value={`${state.truckProfile.pickedCount} عملية`}
          />
          <DetailRow
            label="الجولات المكتملة"
            value={`${state.truckProfile.completedTrips} جولات`}
          />
          <DetailRow
            label="عدد الطلبات الحالية"
            value={`${state.signals.length} طلبات`}
          />
        </View>
        <View style={{ marginTop: 16 }}>
          <PrimaryButton
            label="فتح ماسح QR"
            onPress={() => navigation.navigate("TruckQrScanner")}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>حالة الطلبات</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          <View style={styles.signalCard}>
            <Text style={styles.signalId}>{waitingCount}</Text>
            <Text style={styles.signalMeta}>قيد الانتظار</Text>
          </View>
          <View style={styles.signalCard}>
            <Text style={styles.signalId}>{onWayCount}</Text>
            <Text style={styles.signalMeta}>في الطريق</Text>
          </View>
          <View style={styles.signalCard}>
            <Text style={styles.signalId}>{arrivedCount}</Text>
            <Text style={styles.signalMeta}>وصلت</Text>
          </View>
          <View style={styles.signalCard}>
            <Text style={styles.signalId}>{pickedCount}</Text>
            <Text style={styles.signalMeta}>تم جمعها</Text>
          </View>
        </View>
      </View>
      <LogoutButton />
    </ScreenShell>
  );
}
