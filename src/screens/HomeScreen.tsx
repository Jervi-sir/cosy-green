import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { AppHeaderBar } from '../components/ui/AppHeaderBar';
import { BottomActionDock } from '../components/ui/BottomActionDock';
import { colors, shadow } from '../theme';

const mapPins = [
  { left: 36, top: 78, color: '#59A6E2' },
  { left: 112, top: 40, color: '#59A6E2' },
  { left: 174, top: 64, color: '#F1A52D' },
  { left: 242, top: 44, color: '#59A6E2' },
  { left: 24, top: 136, color: '#E73C35' },
  { left: 88, top: 116, color: '#E73C35' },
  { left: 152, top: 132, color: '#E73C35' },
  { left: 214, top: 120, color: '#E73C35' },
  { left: 262, top: 154, color: '#59A6E2' },
  { left: 54, top: 220, color: '#59A6E2' },
  { left: 110, top: 188, color: '#59A6E2' },
  { left: 190, top: 196, color: '#E73C35' },
  { left: 236, top: 218, color: '#E73C35' },
  { left: 44, top: 290, color: '#59A6E2' },
  { left: 102, top: 276, color: '#59A6E2' },
  { left: 162, top: 254, color: '#21B54A' },
  { left: 230, top: 278, color: '#E73C35' },
  { left: 272, top: 240, color: '#21B54A' },
] as const;

const bottomActions: Array<{
  key: string;
  icon: 'truck-fast' | 'message-outline' | 'home' | 'bag-personal' | 'phone-outline';
  active?: boolean;
}> = [
  { key: 'truck', icon: 'truck-fast', active: true },
  { key: 'message', icon: 'message-outline' },
  { key: 'home', icon: 'home' },
  { key: 'bag', icon: 'bag-personal' },
  { key: 'phone', icon: 'phone-outline' },
];

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppHeaderBar title="السائق" />

        <View style={styles.content}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>D</Text>
            </View>
            <Text style={styles.profileName}>D.mohamed</Text>
          </View>

          <View style={styles.mapCard}>
            <View style={[styles.road, styles.roadA]} />
            <View style={[styles.road, styles.roadB]} />
            <View style={[styles.road, styles.roadC]} />
            <View style={[styles.road, styles.roadD]} />
            <View style={[styles.road, styles.roadE]} />
            <View style={[styles.road, styles.roadF]} />

            <View style={styles.blockA} />
            <View style={styles.blockB} />
            <View style={styles.blockC} />
            <View style={styles.blockD} />
            <View style={styles.blockE} />
            <View style={styles.blockF} />
            <View style={styles.blockG} />
            <View style={styles.blockH} />
            <View style={styles.blockI} />
            <View style={styles.blockJ} />
            <View style={styles.roundabout} />
            <View style={styles.park} />

            {mapPins.map((pin, index) => (
              <View key={`${pin.left}-${pin.top}-${index}`} style={[styles.pinWrap, { left: pin.left, top: pin.top }]}>
                <Ionicons name="location-sharp" size={12} color={pin.color} />
              </View>
            ))}

            <View style={styles.driverMarker}>
              <MaterialCommunityIcons name="truck-fast" size={16} color="#1EB54A" />
            </View>

            <Text style={[styles.mapLabel, styles.labelA]}>Vulcanisation Auto</Text>
            <Text style={[styles.mapLabel, styles.labelB]}>Primo snack</Text>
            <Text style={[styles.mapLabel, styles.labelC]}>L'EURL MAISON DECO</Text>
            <Text style={[styles.mapLabel, styles.labelD]}>Cosmétique makhlouf</Text>
          </View>
        </View>

        <View style={styles.bottomLeftCircle} />
        <View style={styles.bottomRightCircle} />

        <BottomActionDock items={[...bottomActions]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 14,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 18,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#53413C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    ...shadow.card,
  },
  avatarText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  profileName: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '800',
  },
  mapCard: {
    height: 362,
    borderWidth: 1,
    borderColor: '#8A8A8A',
    backgroundColor: '#D0C5B8',
    overflow: 'hidden',
    position: 'relative',
  },
  road: {
    position: 'absolute',
    backgroundColor: '#B0A89E',
    borderColor: '#EEE8DE',
    borderWidth: 2,
  },
  roadA: {
    width: 350,
    height: 38,
    top: 42,
    left: -18,
    transform: [{ rotate: '18deg' }],
  },
  roadB: {
    width: 340,
    height: 36,
    top: 108,
    left: -20,
    transform: [{ rotate: '-12deg' }],
  },
  roadC: {
    width: 320,
    height: 36,
    top: 180,
    left: -14,
    transform: [{ rotate: '30deg' }],
  },
  roadD: {
    width: 36,
    height: 390,
    top: -16,
    left: 140,
    transform: [{ rotate: '4deg' }],
  },
  roadE: {
    width: 34,
    height: 300,
    top: 18,
    left: 220,
    transform: [{ rotate: '-12deg' }],
  },
  roadF: {
    width: 240,
    height: 30,
    top: 246,
    left: 70,
    transform: [{ rotate: '-22deg' }],
  },
  blockA: {
    position: 'absolute',
    top: 22,
    left: 16,
    width: 76,
    height: 44,
    backgroundColor: '#C6BBB0',
    transform: [{ rotate: '12deg' }],
  },
  blockB: {
    position: 'absolute',
    top: 18,
    left: 188,
    width: 88,
    height: 58,
    backgroundColor: '#C3B6AA',
    transform: [{ rotate: '-11deg' }],
  },
  blockC: {
    position: 'absolute',
    top: 92,
    left: 72,
    width: 54,
    height: 48,
    backgroundColor: '#C9BEB1',
    transform: [{ rotate: '8deg' }],
  },
  blockD: {
    position: 'absolute',
    top: 106,
    right: 22,
    width: 78,
    height: 54,
    backgroundColor: '#C4B7AB',
    transform: [{ rotate: '10deg' }],
  },
  blockE: {
    position: 'absolute',
    top: 172,
    left: 18,
    width: 70,
    height: 48,
    backgroundColor: '#C8BCAF',
    transform: [{ rotate: '6deg' }],
  },
  blockF: {
    position: 'absolute',
    top: 174,
    left: 180,
    width: 66,
    height: 58,
    backgroundColor: '#C5B8AB',
    transform: [{ rotate: '-10deg' }],
  },
  blockG: {
    position: 'absolute',
    bottom: 90,
    left: 44,
    width: 72,
    height: 50,
    backgroundColor: '#C5B9AE',
    transform: [{ rotate: '-14deg' }],
  },
  blockH: {
    position: 'absolute',
    bottom: 78,
    left: 190,
    width: 96,
    height: 58,
    backgroundColor: '#C4B7AB',
    transform: [{ rotate: '8deg' }],
  },
  blockI: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    width: 94,
    height: 40,
    backgroundColor: '#C7BBAD',
    transform: [{ rotate: '2deg' }],
  },
  blockJ: {
    position: 'absolute',
    bottom: 24,
    right: 18,
    width: 86,
    height: 44,
    backgroundColor: '#C6BBAD',
    transform: [{ rotate: '-6deg' }],
  },
  roundabout: {
    position: 'absolute',
    top: 86,
    left: 132,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B7AEA2',
    borderWidth: 2,
    borderColor: '#E7E0D6',
  },
  park: {
    position: 'absolute',
    left: 14,
    bottom: 106,
    width: 38,
    height: 34,
    backgroundColor: '#86AA79',
    borderRadius: 3,
  },
  pinWrap: {
    position: 'absolute',
  },
  driverMarker: {
    position: 'absolute',
    left: 76,
    bottom: 56,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLabel: {
    position: 'absolute',
    color: '#444444',
    fontSize: 7,
    fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 2,
  },
  labelA: {
    top: 28,
    right: 28,
  },
  labelB: {
    top: 88,
    right: 42,
  },
  labelC: {
    bottom: 92,
    right: 28,
  },
  labelD: {
    bottom: 34,
    right: 18,
  },
  bottomLeftCircle: {
    position: 'absolute',
    left: -36,
    bottom: 18,
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: '#A6EDC0',
    zIndex: -1,
  },
  bottomRightCircle: {
    position: 'absolute',
    right: -30,
    bottom: 94,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#2BD793',
  },
});
