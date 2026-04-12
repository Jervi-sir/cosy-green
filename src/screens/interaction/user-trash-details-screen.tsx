import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, Text, View } from "react-native";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAppFlow } from "./context";
import { styles } from "./styles";
import { DetailRow, HeroHeader, ScreenShell } from "./ui";

export function UserTrashDetailsScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "UserTrashDetails">) {
  const { state, scanCurrentSignal } = useAppFlow();
  const signal = state.signals.find(
    (entry) => entry.id === route.params.signalId,
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
        subtitle="افتح تفاصيل النفايات وأظهر رمز QR هذا للشاحنة عند وصولها."
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

      {signal.status === "Arrived" || signal.status === "Picked" ? (
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>
            {signal.status === "Picked"
              ? "تم مسح الرمز"
              : "أظهر هذا الرمز للشاحنة"}
          </Text>
          <Text style={styles.qrSubtitle}>
            {signal.status === "Picked"
              ? `تم تأكيد الاستلام${signal.scannedAt ? ` - ${signal.scannedAt}` : ""}`
              : "يمكن للشاحنة مسح هذا الرمز لتأكيد الاستلام."}
          </Text>
          <FakeQr value={signal.qrCode} />
          <Text style={styles.qrCodeText}>{signal.qrCode}</Text>
          {signal.status === "Arrived" ? (
            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                scanCurrentSignal();
                navigation.goBack();
              }}
            >
              <Text style={styles.primaryButtonText}>تحديد كممسوح ومستلم</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </ScreenShell>
  );
}

function FakeQr({ value }: { value: string }) {
  const outer = value.padEnd(16, "0").slice(0, 16).split("");
  const inner = value.padEnd(4, "0").slice(0, 4).split("");
  const cells = outer.flatMap((char, row) =>
    inner.map((innerChar, column) => ({
      key: `${char}-${innerChar}-${row}-${column}`,
      filled:
        (char.charCodeAt(0) + innerChar.charCodeAt(0) + row + column) % 2 === 0,
    })),
  );

  return (
    <View style={styles.qrGrid}>
      {cells.map((cell) => (
        <View
          key={cell.key}
          style={[styles.qrCell, cell.filled && styles.qrCellFilled]}
        />
      ))}
    </View>
  );
}
