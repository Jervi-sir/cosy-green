import { useMemo, useState } from "react";
import { Alert, Text, Pressable, StyleSheet, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "@/navigation/AppNavigator";
import { colors, radius, shadow } from "@/theme";
import { useAppFlow } from "../interaction/context";
import { ScreenShell } from "../interaction/ui";

export function TruckQrScannerScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "TruckQrScanner">) {
  const { state, scanSignalByQrCode } = useAppFlow();
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const signal = useMemo(
    () => {
      const signalId = route.params?.signalId;
      return signalId
        ? state.signals.find((entry) => entry.backendId === signalId)
        : undefined;
    },
    [route.params?.signalId, state.signals],
  );

  const handleCodeScanned = async ({ data }: { data: string }) => {
    if (locked) {
      return;
    }

    setLocked(true);
    Alert.alert("تأكيد الالتقاط", "هل تم أخذ هذه النفايات؟", [
      {
        text: "لا",
        style: "cancel",
        onPress: () => setLocked(false),
      },
      {
        text: "نعم",
        onPress: async () => {
          const didScan = await scanSignalByQrCode(data);
          if (didScan) {
            setFeedback("تم مسح رمز QR وتأكيد الالتقاط.");
            setTimeout(() => navigation.goBack(), 700);
            return;
          }

          setFeedback("الرمز غير صالح أو أن هذا الطلب غير جاهز للتأكيد حالياً.");
          setTimeout(() => setLocked(false), 1400);
        },
      },
    ]);
  };

  if (!permission) {
    return <ScreenShell><View style={screenStyles.centerState} /></ScreenShell>;
  }

  if (!permission.granted) {
    return (
      <ScreenShell>
        <View style={screenStyles.centerState}>
          <Text style={screenStyles.stateTitle}>نحتاج إذن الكاميرا لقراءة رمز QR</Text>
          <Text style={screenStyles.stateText}>
            امنح الإذن ثم افتح الماسح لتأكيد أن الشاحنة التقطت الطلب.
          </Text>
          <Pressable style={screenStyles.actionButton} onPress={requestPermission}>
            <Text style={screenStyles.actionButtonText}>سماح بالكاميرا</Text>
          </Pressable>
        </View>
      </ScreenShell>
    );
  }

  return (
    <View style={screenStyles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleCodeScanned}
      />

      <View style={screenStyles.overlay}>
        <View style={screenStyles.headerRow}>
          <Pressable style={screenStyles.ghostButton} onPress={() => navigation.goBack()}>
            <Text style={screenStyles.ghostButtonText}>إغلاق</Text>
          </Pressable>
          <View style={screenStyles.headerCopy}>
            <Text style={screenStyles.headerTitle}>مسح QR للشاحنة</Text>
            <Text style={screenStyles.headerSubtitle}>
              {signal
                ? `${signal.id} - ${signal.address}`
                : "امسح أي رمز QR صالح لتأكيد الالتقاط"}
            </Text>
          </View>
        </View>

        <View style={screenStyles.scanFrame} />

        <View style={screenStyles.footerCard}>
          <Text style={screenStyles.footerTitle}>وجّه الكاميرا نحو رمز العميل</Text>
          <Text style={screenStyles.footerText}>
            يمكن لهذا الماسح قراءة أي رمز QR صالح، لكن التأكيد ينجح فقط إذا كانت حالة الطلب "وصل".
          </Text>
          {feedback ? <Text style={screenStyles.feedbackText}>{feedback}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.white,
    textAlign: "right",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(255,255,255,0.84)",
    textAlign: "right",
  },
  ghostButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  ghostButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.white,
  },
  scanFrame: {
    alignSelf: "center",
    width: 240,
    height: 240,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.gold,
    backgroundColor: "transparent",
  },
  footerCard: {
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.94)",
    gap: 4,
    ...shadow.card,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "right",
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.text,
    textAlign: "right",
  },
  feedbackText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDeep,
    textAlign: "right",
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: colors.surface,
  },
  stateTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.ink,
    textAlign: "center",
  },
  stateText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
    textAlign: "center",
  },
  actionButton: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.white,
  },
});
