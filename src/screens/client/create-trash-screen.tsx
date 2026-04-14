import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, {
  Marker,
  Polyline,
  type MapPressEvent,
} from "react-native-maps";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { colors, radius, shadow } from "../../theme";
import { useAppFlow } from "../interaction/context";
import { mapRegion, truckRoute, wasteOptions } from "../interaction/data";
import { styles } from "../interaction/styles";
import { type WasteType } from "../interaction/types";
import { PrimaryButton, ScreenShell } from "../interaction/ui";

export function CreateTrashScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RequestDetails">) {
  const { state, submitSignal } = useAppFlow();
  const [selectedWaste, setSelectedWaste] = useState<WasteType[]>(
    state.wasteTypes,
  );
  const [note, setNote] = useState(state.note);
  const [address, setAddress] = useState(state.address);
  const [coordinate, setCoordinate] = useState(state.coordinate);

  const toggleWaste = (item: WasteType) => {
    setSelectedWaste((current) =>
      current.includes(item)
        ? current.filter((entry) => entry !== item)
        : [...current, item],
    );
  };

  const onMapPress = (event: MapPressEvent) => {
    const nextCoordinate = event.nativeEvent.coordinate;
    setCoordinate(nextCoordinate);
    setAddress(
      `محدد في ${nextCoordinate.latitude.toFixed(4)}, ${nextCoordinate.longitude.toFixed(4)}`,
    );
  };

  return (
    <ScreenShell includeTopSafeArea={false}>
      <View style={screenStyles.container}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={mapRegion}
          onPress={onMapPress}
        >
          <Polyline
            coordinates={truckRoute.map((point) => ({
              latitude: point.latitude,
              longitude: point.longitude,
            }))}
            strokeColor={colors.primaryDeep}
            strokeWidth={4}
            lineDashPattern={[8, 6]}
          />
          {truckRoute.map((stop) => (
            <Marker
              key={stop.key}
              coordinate={{
                latitude: stop.latitude,
                longitude: stop.longitude,
              }}
              title={stop.label}
              description="نقطة محتملة لمرور الشاحنة"
              pinColor={colors.gold}
            />
          ))}
          <Marker
            coordinate={coordinate}
            title="موقع النفايات الخاص بك"
            pinColor={colors.coral}
          />
        </MapView>

        <View style={screenStyles.topOverlay}>
          <View style={screenStyles.headerCard}>
            <Pressable
              style={styles.headerAction}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.headerActionText}>رجوع</Text>
            </Pressable>
            <View style={screenStyles.headerCopy}>
              <Text style={screenStyles.headerTitle}>إضافة إشارة نفايات</Text>
              <Text style={screenStyles.headerSubtitle}>
                اختر الموقع على الخارطة ثم أكمل البيانات بشكل سريع.
              </Text>
            </View>
          </View>

          <View style={screenStyles.addressBadge}>
            <Ionicons name="location" size={14} color={colors.coral} />
            <Text style={screenStyles.addressText}>{address}</Text>
          </View>

          <View style={screenStyles.routeHint}>
            <Ionicons name="git-commit" size={14} color={colors.gold} />
            <Text style={screenStyles.routeHintText}>
              المسار والنقاط الصفراء تمثل أماكن محتملة لمرور الشاحنة
            </Text>
          </View>
        </View>

        <View style={screenStyles.bottomOverlay}>
          <View style={screenStyles.panel}>
            <View>
              <Text style={styles.label}>محتوى النفايات</Text>
              <View style={screenStyles.chipWrap}>
                {wasteOptions.map((item) => {
                  const active = selectedWaste.includes(item);
                  return (
                    <Pressable
                      key={item}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => toggleWaste(item)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={screenStyles.inputBlock}>
              <Text style={styles.label}>ملاحظة الاستلام</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                style={[styles.input, styles.textArea, screenStyles.noteInput]}
                multiline
                placeholder="أضف ملاحظة قصيرة للسائق"
                placeholderTextColor={colors.muted}
              />
            </View>

            <PrimaryButton
              label="حفظ إشارة النفايات"
              onPress={() => {
                submitSignal({
                  wasteTypes: selectedWaste,
                  note,
                  address,
                  coordinate,
                }).then(() => navigation.goBack());
              }}
            />
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
  topOverlay: {
    position: "absolute",
    top: 40,
    left: 12,
    right: 12,
    gap: 10,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.95)",
    ...shadow.card,
  },
  headerCopy: {
    flex: 1,
    alignItems: "flex-end",
    gap: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.ink,
    textAlign: "right",
  },
  headerSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
    textAlign: "right",
  },
  addressBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.94)",
    ...shadow.card,
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "right",
  },
  routeHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: "rgba(18,49,42,0.8)",
  },
  routeHintText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
    textAlign: "right",
  },
  bottomOverlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 16,
  },
  panel: {
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.96)",
    gap: 12,
    ...shadow.card,
  },
  chipWrap: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  inputBlock: {
    gap: 8,
  },
  noteInput: {
    height: 92,
    backgroundColor: colors.white,
  },
});
