import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenShell } from '../components/ScreenShell';
import { SectionHeader } from '../components/SectionHeader';
import { quickActions, requests, schedule } from '../data/mockData';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radius, shadow } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const activeRequest = requests[0];

  return (
    <ScreenShell>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good evening</Text>
          <Text style={styles.name}>Rania, your block is 92% clear today.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RA</Text>
        </View>
      </View>

      <LinearGradient colors={['#199B56', '#29BE77']} style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroLabel}>Active municipal case</Text>
            <Text style={styles.heroTitle}>{activeRequest.title}</Text>
          </View>
          <View style={styles.heroBadge}>
            <Ionicons name="navigate" size={16} color={colors.primaryDeep} />
            <Text style={styles.heroBadgeText}>{activeRequest.eta}</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${activeRequest.progress * 100}%` }]} />
        </View>

        <View style={styles.heroStats}>
          <View>
            <Text style={styles.heroStatLabel}>Status</Text>
            <Text style={styles.heroStatValue}>{activeRequest.status}</Text>
          </View>
          <View>
            <Text style={styles.heroStatLabel}>Address</Text>
            <Text style={styles.heroStatValue}>{activeRequest.address}</Text>
          </View>
        </View>

        <Pressable style={styles.heroButton} onPress={() => navigation.navigate('RequestDetails')}>
          <Text style={styles.heroButtonText}>Open live tracking</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.primaryDeep} />
        </Pressable>
      </LinearGradient>

      <View style={styles.sectionGap}>
        <SectionHeader eyebrow="Services" title="Quick actions" />
      </View>
      <View style={styles.actionGrid}>
        {quickActions.map((action) => (
          <Pressable key={action.id} style={styles.actionCard}>
            <View style={styles.actionIconWrap}>
              <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.primaryDeep} />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionGap}>
        <SectionHeader eyebrow="Calendar" title="This week's routes" action="Municipality" />
      </View>
      {schedule.map((item) => (
        <View key={item.day} style={styles.scheduleCard}>
          <View style={[styles.dayPill, { backgroundColor: item.tone }]}>
            <Text style={styles.dayText}>{item.day}</Text>
          </View>
          <View style={styles.scheduleCopy}>
            <Text style={styles.scheduleTitle}>{item.title}</Text>
            <Text style={styles.scheduleTime}>{item.time}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 26,
  },
  greeting: {
    color: colors.primaryDeep,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  name: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    maxWidth: 270,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  heroCard: {
    borderRadius: radius.xl,
    padding: 22,
    ...shadow.card,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 22,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
    maxWidth: 180,
  },
  heroBadge: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  heroBadgeText: {
    color: colors.primaryDeep,
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
  },
  heroStats: {
    gap: 16,
    marginBottom: 20,
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginBottom: 4,
  },
  heroStatValue: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  heroButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroButtonText: {
    color: colors.primaryDeep,
    fontSize: 15,
    fontWeight: '800',
  },
  sectionGap: {
    marginTop: 30,
    marginBottom: 16,
  },
  actionGrid: {
    gap: 14,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  actionSubtitle: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 260,
  },
  scheduleCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  dayPill: {
    minWidth: 58,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  dayText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  scheduleCopy: {
    flex: 1,
  },
  scheduleTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  scheduleTime: {
    color: colors.muted,
    fontSize: 13,
  },
});
