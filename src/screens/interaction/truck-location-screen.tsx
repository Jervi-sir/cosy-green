import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import { useAppFlow } from "./context";
import { mapRegion, truckRoute } from "./data";
import { styles } from "./styles";
import { HeroHeader, InfoBanner, PrimaryButton, ScreenShell } from "./ui";
import { colors } from "../../theme";
import { LogoutButton } from "@/components/LogoutButton";

export function TruckLocationScreen() {
  const navigation = useNavigation<any>();
  const { state, moveTruck, getSelectedTruckSignal, resetApp } = useAppFlow();
  const currentSignal = getSelectedTruckSignal();
  const activeTruckCoordinate =
    truckRoute[Math.min(state.truckStep, truckRoute.length - 1)];
  const routeToUser = [
    ...truckRoute.slice(
      0,
      Math.min(state.truckStep + 1, truckRoute.length - 1),
    ),
    {
      key: "user",
      label: "موقعك",
      latitude: currentSignal?.coordinate.latitude ?? state.coordinate.latitude,
      longitude:
        currentSignal?.coordinate.longitude ?? state.coordinate.longitude,
    },
  ];

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="أين الشاحنة؟"
        subtitle="خريطة حية تجريبية توضح اقتراب الشاحنة من موقع النفايات الخاص بك."
      />
      <View style={styles.card}>
        <InfoBanner
          title={`وقت الوصول المتوقع: ${state.truckEta}`}
          text={`التوقف الحالي: ${activeTruckCoordinate.label}${currentSignal ? ` - ${currentSignal.status === "Arrived" ? "وصل" : currentSignal.status === "Picked" ? "تم الاستلام" : currentSignal.status === "Waiting" ? "قيد الانتظار" : "في الطريق"}` : ""}`}
        />
        <View style={styles.largeMapCard}>
          <MapView style={styles.mapView} initialRegion={mapRegion}>
            <Polyline
              coordinates={routeToUser.map((point) => ({
                latitude: point.latitude,
                longitude: point.longitude,
              }))}
              strokeColor={colors.primaryDeep}
              strokeWidth={5}
            />
            {truckRoute.map((stop) => (
              <Marker
                key={stop.key}
                coordinate={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }}
                title={stop.label}
                pinColor="#F6C85F"
              />
            ))}
            <Marker
              coordinate={currentSignal?.coordinate ?? state.coordinate}
              title="أنت"
              description={currentSignal?.address ?? state.address}
              pinColor={colors.coral}
            />
            <Marker
              coordinate={{
                latitude: activeTruckCoordinate.latitude,
                longitude: activeTruckCoordinate.longitude,
              }}
              title="الشاحنة"
              description={state.truckEta}
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
        {currentSignal ? (
          <InfoBanner
            title={`آخر إشارة: ${currentSignal.id}`}
            text={
              currentSignal.status === "Arrived"
                ? `وصلت الشاحنة. يمكن للمواطن الآن فتح رمز QR للمسح في ${currentSignal.address}`
                : currentSignal.status === "Picked"
                  ? `تم تأكيد الاستلام في ${currentSignal.address}`
                  : `${currentSignal.wasteTypes.join(", ")} - ${currentSignal.address}`
            }
          />
        ) : null}
        <PrimaryButton label="تحريك الشاحنة أقرب" onPress={moveTruck} />
      </View>
      <LogoutButton />
    </ScreenShell>
  );
}
