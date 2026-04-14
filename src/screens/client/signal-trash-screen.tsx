import { Ionicons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, Pressable, View } from "react-native";

import { UserTabParamList } from "../../navigation/AppNavigator";
import { apiRequest } from "@/lib/api";
import { colors } from "@/theme";
import { styles } from "../interaction/styles";
import { type TrashSignal } from "../interaction/types";
import { HeroHeader, ScreenShell } from "../interaction/ui";

type Props = BottomTabScreenProps<UserTabParamList, "Signal">;

type ServerSignal = {
  id: string;
  publicId: string;
  wasteTypes: string[];
  note: string;
  address: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  status: "WAITING" | "CONFIRMED" | "ARRIVING" | "ARRIVED" | "PICKED" | "CANCELLED";
  qrCode: string;
  qrUnlocked: boolean;
  acceptedByTruck: boolean;
  acceptedAt?: string | null;
  scannedAt?: string | null;
  createdAt: string;
};

function mapStatus(status: ServerSignal["status"]): TrashSignal["status"] {
  if (status === "ARRIVED") return "Arrived";
  if (status === "PICKED") return "Picked";
  if (status === "CANCELLED") return "Cancelled";
  if (status === "CONFIRMED" || status === "ARRIVING") return "On the way";
  return "Waiting";
}

function mapSignal(signal: ServerSignal): TrashSignal {
  return {
    backendId: signal.id,
    id: signal.publicId,
    wasteTypes: signal.wasteTypes as TrashSignal["wasteTypes"],
    note: signal.note,
    address: signal.address,
    coordinate: signal.coordinate,
    status: mapStatus(signal.status),
    createdAt: new Date(signal.createdAt).toLocaleString("ar-DZ", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    qrCode: signal.qrCode,
    qrUnlocked: signal.qrUnlocked,
    acceptedByTruck: signal.acceptedByTruck,
    acceptedAt: signal.acceptedAt ?? undefined,
    scannedAt: signal.scannedAt ?? undefined,
  };
}

export function SignalTrashScreen({ navigation }: Props) {
  const rootNavigation = useNavigation<any>();
  const [signals, setSignals] = useState<TrashSignal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSignals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest<{ items: ServerSignal[] }>(
        "/trash-signals?mine=true",
      );
      setSignals(response.items.map(mapSignal));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSignals();
    }, [loadSignals]),
  );

  return (
    <ScreenShell
      scroll
      refreshing={loading}
      onRefresh={() => {
        loadSignals();
      }}
    >
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
        {loading ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator color={colors.primaryDeep} />
          </View>
        ) : signals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              لا توجد نفايات مُبلغ عنها بعد. اضغط على إضافة لإنشاء أول طلب.
            </Text>
          </View>
        ) : (
          signals.map((signal) => (
            <Pressable
              key={signal.id}
              style={styles.signalCard}
              onPress={() =>
                rootNavigation.navigate("UserTrashDetails", {
                  signalId: signal.backendId,
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
               <Text style={styles.signalText}>
                 {signal.status === "Picked"
                   ? "تم تسجيل الاستلام وإضافة النقاط إلى حسابك"
                   : signal.acceptedByTruck
                     ? "أكدت الشاحنة هذا الطلب وتم فتح رمز QR"
                     : "بانتظار أن تؤكد الشاحنة مرورها بهذا الطلب"}
               </Text>
             </Pressable>
           ))
         )}
      </View>
    </ScreenShell>
  );
}
