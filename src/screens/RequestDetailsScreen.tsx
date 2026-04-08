import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radius, shadow } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestDetails'>;

const stats = [
  { label: 'بلاستيك', points: '154' },
  { label: 'الورق', points: '29' },
  { label: 'معادن', points: '162' },
];

const bottomActions = [
  { key: 'truck', icon: 'truck-fast', active: true },
  { key: 'message', icon: 'message-outline' },
  { key: 'home', icon: 'home' },
  { key: 'bag', icon: 'bag-personal' },
  { key: 'phone', icon: 'phone-outline' },
];

export function RequestDetailsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="menu" size={24} color="#0A3153" />
          </Pressable>
          <Text style={styles.headerTitle}>نقاطي</Text>
          <Pressable style={styles.headerIcon} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0A3153" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.topRightOrb} />
          <View style={styles.leftOrb} />
          <View style={styles.rightOrb} />
          <View style={styles.bottomLeftOrb} />

          <View style={styles.monthRow}>
            <View style={styles.dayCell}>
              <Text style={styles.dayValue}>9</Text>
            </View>
            <View style={styles.monthCell}>
              <Text style={styles.monthText}>سبتمبر</Text>
            </View>
          </View>

          <View style={styles.weekdayPill}>
            <Text style={styles.weekdayText}>السبت</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerStatText}>النقاط</Text>
              <Text style={styles.headerStatText}>المعدن</Text>
            </View>

            {stats.map((item) => (
              <View key={item.label} style={styles.statRow}>
                <View style={styles.pillLeft}>
                  <Text style={styles.pointsText}>{item.points}</Text>
                </View>
                <View style={styles.pillRight}>
                  <Text style={styles.materialText}>{item.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomDock}>
          {bottomActions.map((action, index) => (
            <View key={action.key} style={[styles.bottomItem, index < bottomActions.length - 1 && styles.bottomDivider]}>
              <MaterialCommunityIcons
                name={action.icon as never}
                size={28}
                color={action.active ? '#08B12E' : '#08B12E'}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 88,
    backgroundColor: '#06A117',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  headerIcon: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 78,
    position: 'relative',
    overflow: 'hidden',
  },
  topRightOrb: {
    position: 'absolute',
    top: 0,
    right: -58,
    width: 122,
    height: 122,
    borderRadius: 61,
    backgroundColor: '#2ED08F',
  },
  leftOrb: {
    position: 'absolute',
    top: 84,
    left: -72,
    width: 208,
    height: 208,
    borderRadius: 104,
    backgroundColor: 'rgba(141, 229, 182, 0.82)',
  },
  rightOrb: {
    position: 'absolute',
    right: -54,
    bottom: 142,
    width: 122,
    height: 122,
    borderRadius: 61,
    backgroundColor: '#2ED08F',
  },
  bottomLeftOrb: {
    position: 'absolute',
    left: -76,
    bottom: -22,
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: '#A7E9BF',
  },
  monthRow: {
    width: 288,
    alignSelf: 'center',
    flexDirection: 'row-reverse',
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  dayCell: {
    width: 72,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#777777',
  },
  monthCell: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayValue: {
    color: '#555555',
    fontSize: 18,
    fontWeight: '700',
  },
  monthText: {
    color: '#4B4B4B',
    fontSize: 22,
    fontWeight: '800',
  },
  weekdayPill: {
    alignSelf: 'center',
    minWidth: 210,
    minHeight: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8B8B8B',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56,
  },
  weekdayText: {
    color: '#585858',
    fontSize: 18,
    fontWeight: '800',
  },
  card: {
    marginTop: 136,
    alignSelf: 'center',
    width: 288,
    backgroundColor: 'rgba(120, 210, 117, 0.88)',
    borderWidth: 1,
    borderColor: '#6C8A63',
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 28,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    marginBottom: 6,
  },
  headerStatText: {
    color: '#6F8D67',
    fontSize: 16,
    fontWeight: '800',
  },
  statRow: {
    flexDirection: 'row',
    marginTop: 12,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    minHeight: 30,
    ...shadow.card,
  },
  pillLeft: {
    width: '34%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 36,
  },
  pointsText: {
    color: '#6C6C6C',
    fontSize: 14,
    fontWeight: '700',
  },
  materialText: {
    color: '#6C6C6C',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomDock: {
    marginHorizontal: 6,
    marginBottom: 8,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#9D9D9D',
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadow.card,
  },
  bottomItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomDivider: {
    borderRightWidth: 1,
    borderRightColor: '#A8A8A8',
  },
});
