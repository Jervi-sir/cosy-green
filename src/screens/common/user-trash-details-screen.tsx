import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";
import { DetailRow, HeroHeader, ScreenShell } from "../interaction/ui";

export function UserTrashDetailsScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "UserTrashDetails">) {
  const { state, simulateTruckScan } = useAppFlow();
  const signal = state.signals.find(
    (entry) => entry.backendId === route.params.signalId,
  );

  if (!signal) {
    return (
      <ScreenShell scroll>
        <HeroHeader
          title="تفاصيل النفايات"
          subtitle="هذا الطلب لم يعد متاحاً."
          backLabel="رجوع"
          onBackPress={() => navigation.goBack()}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scroll>
      <HeroHeader
        title={signal.id}
        subtitle="تابع حالة الطلب. يتم فتح رمز QR بعد تأكيد الشاحنة للاستلام."
        backLabel="رجوع"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.card}>
        <DetailRow
          label="الحالة"
          value={
            signal.status === "Arrived"
              ? "وصل"
              : signal.status === "Picked"
                ? "تم الاستلام"
                : signal.status === "Waiting"
                  ? "قيد الانتظار"
                  : "في الطريق"
          }
        />
        <DetailRow label="المحتوى" value={signal.wasteTypes.join(", ")} />
        <DetailRow label="ملاحظة" value={signal.note} />
        <DetailRow label="الموقع" value={signal.address} />
        <DetailRow label="تاريخ الإنشاء" value={signal.createdAt} />
      </View>

      {signal.acceptedByTruck || signal.status === "Picked" ? (
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>
            {signal.status === "Picked"
              ? "تم مسح الرمز"
              : "أظهر هذا الرمز للشاحنة"}
          </Text>
          <Text style={styles.qrSubtitle}>
            {signal.status === "Picked"
              ? `تم تأكيد الاستلام${signal.scannedAt ? ` - ${signal.scannedAt}` : ""}`
              : signal.status === "Arrived"
                ? "وصلت الشاحنة. اعرض هذا الرمز ليتم المسح وتأكيد الاستلام."
                : "أكدت الشاحنة الطلب. احتفظ بهذا الرمز جاهزاً حتى تصل إليك."}
          </Text>
          <View style={styles.qrGrid}>
            <QRCode value={signal.qrCode} size={176} />
          </View>
          <Text style={styles.qrCodeText}>{signal.qrCode}</Text>
          {/* {signal.status !== "Picked" ? (
            <Pressable
              style={styles.primaryButton}
              onPress={async () => {
                await simulateTruckScan(signal.backendId);
                navigation.goBack();
              }}
            >
              <Text style={styles.primaryButtonText}>محاكاة مسح الرمز</Text>
            </Pressable>
          ) : null} */}
        </View>
      ) : null}
    </ScreenShell>
  );
}
