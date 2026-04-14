import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import { useAppFlow } from "../interaction/context";
import { mapRegion, truckRoute } from "../interaction/data";
import { styles } from "../interaction/styles";
import { PrimaryButton, ScreenShell } from "../interaction/ui";
import { colors, radius, shadow } from "../../theme";

export function TruckLocationScreen() {
  const { state, moveTruck, moveTruckBack, getSelectedTruckSignal } =
    useAppFlow();
  const isTruckMode = state.appRole === "Truck";
  const currentSignal = getSelectedTruckSignal();
  const activeTruckCoordinate =
    truckRoute[Math.min(state.truckStep, truckRoute.length - 1)];
  const nextTruckCoordinate =
    truckRoute[Math.min(state.truckStep + 1, truckRoute.length - 1)];
  const [truckViewMode, setTruckViewMode] = useState<"truck" | "destination">(
    "truck",
  );
  const currentStatus = currentSignal
    ? currentSignal.status === "Arrived"
      ? "وصل"
      : currentSignal.status === "Picked"
        ? "تم الاستلام"
        : currentSignal.status === "Waiting"
          ? "قيد الانتظار"
          : "في الطريق"
    : "في الطريق";
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
  const truckCurrentPath = truckRoute
    .slice(0, state.truckStep + 1)
    .map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    }));
  const truckDestinationPath =
    state.truckStep >= truckRoute.length - 1
      ? [
          {
            latitude: activeTruckCoordinate.latitude,
            longitude: activeTruckCoordinate.longitude,
          },
        ]
      : truckRoute.slice(state.truckStep, state.truckStep + 2).map((point) => ({
          latitude: point.latitude,
          longitude: point.longitude,
        }));
  const mapLine = useMemo(() => {
    if (!isTruckMode) {
      return routeToUser.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));
    }

    return truckViewMode === "truck" ? truckCurrentPath : truckDestinationPath;
  }, [
    isTruckMode,
    routeToUser,
    truckCurrentPath,
    truckDestinationPath,
    truckViewMode,
  ]);
  const focusTitle = isTruckMode
    ? truckViewMode === "truck"
      ? "موقع الشاحنة الآن"
      : "الوجهة التالية"
    : "التوقف الحالي";
  const focusPillLabel = isTruckMode
    ? truckViewMode === "truck"
      ? activeTruckCoordinate.label
      : nextTruckCoordinate.label
    : activeTruckCoordinate.label;
  const focusDescription = isTruckMode
    ? truckViewMode === "truck"
      ? activeTruckCoordinate.label
      : nextTruckCoordinate.label
    : currentSignal
      ? `${currentSignal.address} - ${currentStatus}`
      : "الشاحنة في الطريق إلى موقعك";

  return (
    <ScreenShell includeTopSafeArea={false}>
      <View style={screenStyles.container}>
        <MapView style={StyleSheet.absoluteFill} initialRegion={mapRegion}>
          <Polyline
            coordinates={mapLine}
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

        {isTruckMode ? (
          <View style={screenStyles.moveControls}>
            <View style={screenStyles.moveButtonWrap}>
              <Pressable
                style={screenStyles.secondaryMoveButton}
                onPress={moveTruckBack}
              >
                <Text style={screenStyles.secondaryMoveButtonText}>
                  إرجاع الشاحنة نقطة
                </Text>
              </Pressable>
            </View>
            <View style={screenStyles.moveButtonWrap}>
              <PrimaryButton label="تحريك الشاحنة أقرب" onPress={moveTruck} />
            </View>
          </View>
        ) : null}

        <View style={screenStyles.bottomOverlay}>
          {isTruckMode ? (
            <View style={screenStyles.modeSwitch}>
              <Pressable
                style={[
                  screenStyles.modeChip,
                  truckViewMode === "truck" && screenStyles.modeChipActive,
                ]}
                onPress={() => setTruckViewMode("truck")}
              >
                <Text
                  style={[
                    screenStyles.modeChipText,
                    truckViewMode === "truck" &&
                      screenStyles.modeChipTextActive,
                  ]}
                >
                  موقع الشاحنة
                </Text>
              </Pressable>
              <Pressable
                style={[
                  screenStyles.modeChip,
                  truckViewMode === "destination" &&
                    screenStyles.modeChipActive,
                ]}
                onPress={() => setTruckViewMode("destination")}
              >
                <Text
                  style={[
                    screenStyles.modeChipText,
                    truckViewMode === "destination" &&
                      screenStyles.modeChipTextActive,
                  ]}
                >
                  الوجهة التالية
                </Text>
              </Pressable>
            </View>
          ) : null}

          <View style={screenStyles.floatingPanel}>
            <View style={screenStyles.metricsRow}>
              <View style={screenStyles.metricChip}>
                <Text style={screenStyles.metricLabel}>وقت الوصول</Text>
                <Text style={screenStyles.metricValue}>{state.truckEta}</Text>
              </View>
              <View style={screenStyles.metricChip}>
                <Text style={screenStyles.metricLabel}>الحالة الآن</Text>
                <Text style={screenStyles.metricValue}>{currentStatus}</Text>
              </View>
            </View>

            <View style={screenStyles.panelHeader}>
              <View style={screenStyles.routePill}>
                <Text style={screenStyles.routePillText}>{focusPillLabel}</Text>
              </View>
              <View style={screenStyles.panelCopy}>
                <Text style={screenStyles.panelTitle}>{focusTitle}</Text>
                <Text style={screenStyles.panelText}>{focusDescription}</Text>
              </View>
            </View>

            {currentSignal && !isTruckMode ? (
              <View style={screenStyles.signalCard}>
                <Text style={screenStyles.signalTitle}>
                  آخر إشارة: {currentSignal.id}
                </Text>
                <Text style={screenStyles.signalText}>
                  {currentSignal.status === "Arrived"
                    ? `وصلت الشاحنة. يمكن للمواطن الآن فتح رمز QR للمسح في ${currentSignal.address}`
                    : currentSignal.status === "Picked"
                      ? `تم تأكيد الاستلام في ${currentSignal.address}`
                      : currentSignal.acceptedByTruck
                        ? `أكدت الشاحنة هذا الطلب. تم فتح رمز QR والاتجاه الآن إلى ${currentSignal.address}`
                        : `${currentSignal.wasteTypes.join(", ")} - ${currentSignal.address}`}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </ScreenShell>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroCopy: {
    flex: 1,
    alignItems: "flex-end",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.ink,
    textAlign: "right",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
  },
  metricChip: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.surfaceStrong,
    alignItems: "flex-end",
    gap: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.muted,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDeep,
  },
  modeSwitch: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  modeChip: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
  },
  modeChipActive: {
    backgroundColor: colors.primaryDeep,
    borderColor: colors.primaryDeep,
  },
  modeChipText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primaryDeep,
  },
  modeChipTextActive: {
    color: colors.white,
  },
  moveControls: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 40,
    gap: 8,
  },
  moveButtonWrap: {
    alignSelf: "flex-start",
    minWidth: 170,
  },
  secondaryMoveButton: {
    height: 52,
    paddingHorizontal: 20,
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryMoveButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
  },
  bottomOverlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 88,
  },
  floatingPanel: {
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.96)",
    gap: 10,
    ...shadow.card,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  routePillText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primaryDeep,
  },
  panelCopy: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4,
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "right",
  },
  panelText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.text,
    textAlign: "right",
  },
  signalCard: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(221,239,247,0.9)",
    gap: 4,
  },
  signalTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.navy,
    textAlign: "right",
  },
  signalText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#36556B",
    textAlign: "right",
  },
});
