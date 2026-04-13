import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { colors } from "../../theme";
import { useAppFlow } from "../interaction/context";
import { mapRegion, truckRoute } from "../interaction/data";
import { styles } from "../interaction/styles";
import {
  DetailRow,
  HeroHeader,
  InfoBanner,
  PrimaryButton,
  ScreenShell,
} from "../interaction/ui";

export function DriverTrashDetailsScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "TruckTrashDetails">) {
  const { state, confirmTruckSignal, selectTruckSignal, scanCurrentSignal } =
    useAppFlow();
  const signal = state.signals.find(
    (entry) => entry.id === route.params.signalId,
  );
  const activeTruckCoordinate =
    truckRoute[Math.min(state.truckStep, truckRoute.length - 1)];

  if (!signal) {
    return (
      <ScreenShell scroll>
        <HeroHeader
          title="تفاصيل النفايات"
          subtitle="هذا الطلب لم يعد موجوداً."
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
        subtitle="أكد الطلب أولاً، ثم امسح رمز QR عند الوصول لإتمام الاستلام."
        backLabel="رجوع"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.card}>
        <InfoBanner title="طلب الاستلام" text={signal.address} />
        <DetailRow label="نوع النفايات" value={signal.wasteTypes.join(", ")} />
        <DetailRow label="ملاحظة" value={signal.note} />
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
        <DetailRow
          label="رمز QR"
          value={signal.acceptedByTruck || signal.status === "Picked" ? signal.qrCode : "يظهر بعد تأكيد الاستلام"}
        />
        {!signal.acceptedByTruck ? (
          <PrimaryButton
            label="تأكيد أن الشاحنة ستلتقط الطلب"
            onPress={() => {
              confirmTruckSignal(signal.id);
              navigation.goBack();
            }}
          />
        ) : null}
        {signal.acceptedByTruck && signal.status === "Arrived" ? (
          <PrimaryButton
            label="مسح رمز QR وتأكيد الالتقاط"
            onPress={() => {
              selectTruckSignal(signal.id);
              scanCurrentSignal();
              navigation.goBack();
            }}
          />
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>خارطة الاستلام</Text>
        <View style={styles.driverMapCard}>
          <MapView style={styles.mapView} initialRegion={mapRegion}>
            <Polyline
              coordinates={truckRoute.map((point) => ({
                latitude: point.latitude,
                longitude: point.longitude,
              }))}
              strokeColor="#7AA6B8"
              strokeWidth={4}
            />
            <Marker
              coordinate={signal.coordinate}
              title="العميل"
              pinColor={colors.coral}
            />
            <Marker
              coordinate={{
                latitude: activeTruckCoordinate.latitude,
                longitude: activeTruckCoordinate.longitude,
              }}
              title="السائق"
            >
              <View style={styles.truckMarker}>
                <MaterialCommunityIcons
                  name="truck-fast"
                  size={18}
                  color={colors.white}
                />
              </View>
            </Marker>
          </MapView>
        </View>
      </View>
    </ScreenShell>
  );
}
