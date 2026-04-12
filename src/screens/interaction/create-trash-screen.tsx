import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Marker, type MapPressEvent } from "react-native-maps";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { colors } from "../../theme";
import { useAppFlow } from "./context";
import { mapRegion, wasteOptions } from "./data";
import { styles } from "./styles";
import { type WasteType } from "./types";
import { HeroHeader, PrimaryButton, ScreenShell } from "./ui";

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
    <ScreenShell scroll>
      <HeroHeader
        title="إضافة إشارة نفايات"
        subtitle="حدد البيانات، أضف ملاحظة، واختر الموقع على الخارطة."
        backLabel="رجوع"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.card}>
        <Text style={styles.label}>محتوى النفايات</Text>
        <View style={styles.chipWrap}>
          {wasteOptions.map((item) => {
            const active = selectedWaste.includes(item);
            return (
              <Pressable
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleWaste(item)}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>ملاحظة الاستلام</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <Text style={styles.label}>اختر موقعك</Text>
        <View style={styles.mapCard}>
          <MapView
            style={styles.mapView}
            initialRegion={mapRegion}
            onPress={onMapPress}
          >
            <Marker
              coordinate={coordinate}
              title="موقع النفايات الخاص بك"
              pinColor={colors.coral}
            />
          </MapView>
          <View style={styles.mapBadge}>
            <Ionicons name="location" size={14} color={colors.coral} />
            <Text style={styles.mapBadgeText}>{address}</Text>
          </View>
        </View>

        <PrimaryButton
          label="حفظ إشارة النفايات"
          onPress={() => {
            submitSignal({
              wasteTypes: selectedWaste,
              note,
              address,
              coordinate,
            });
            navigation.goBack();
          }}
        />
      </View>
    </ScreenShell>
  );
}
