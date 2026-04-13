import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";

import { useAppFlow } from "../interaction/context";
import { styles } from "../interaction/styles";
import { DetailRow, HeroHeader, ScreenShell } from "../interaction/ui";
import { colors, radius } from "@/theme";
import { LogoutButton } from "@/components/LogoutButton";

export function PointsScreen() {
  const { state, getCurrentSignal, resetApp } = useAppFlow();
  const currentSignal = getCurrentSignal();

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="النقاط المكتسبة"
        subtitle="مفهوم المكافأة لكل إشارة نفايات ناجحة ومفرزة جيداً."
      />
      <View style={styles.pointsHero}>
        <Text style={styles.pointsValue}>{state.points}</Text>
        <Text style={styles.pointsLabel}>نقاط بيئية</Text>
        <Text style={styles.pointsText}>
          فرز البلاستيك والخبز والمعدن يمنح مكافآت أفضل في هذا المفهوم.
        </Text>
      </View>
      <View style={styles.card}>
        <DetailRow
          label="آخر إجراء"
          value={
            currentSignal
              ? currentSignal.status === "Picked"
                ? `إشارة ${currentSignal.id} تم مسحها واستلامها`
                : `إشارة ${currentSignal.id} تم إنشاؤها`
              : "لا توجد إشارة بعد"
          }
        />
        <DetailRow label="أخرى" value="+35 نقطة للفرز" />
        <DetailRow
          label="نوع المنشأة"
          value={state.venueType === "House" ? "منزل" : "مطعم"}
        />
        <DetailRow
          label="آخر النفايات"
          value={
            currentSignal ? currentSignal.wasteTypes.join(", ") : "لا يوجد بعد"
          }
        />
        <DetailRow
          label="آخر حالة"
          value={
            currentSignal
              ? currentSignal.status === "Arrived"
                ? "وصل"
                : currentSignal.status === "Picked"
                  ? "تم الاستلام"
                  : currentSignal.status === "Waiting"
                    ? "قيد الانتظار"
                    : "في الطريق"
              : "بدون حالة"
          }
        />
        <DetailRow
          label="مكافأة الاستلام"
          value={
            currentSignal?.status === "Picked"
              ? "تم منح النقاط"
              : "بانتظار مسح الشاحنة"
          }
        />
      </View>
      <LogoutButton />
    </ScreenShell>
  );
}
