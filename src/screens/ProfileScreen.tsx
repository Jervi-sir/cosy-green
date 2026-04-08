import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenShell } from '../components/ScreenShell';
import { SectionHeader } from '../components/SectionHeader';
import { profileMetrics } from '../data/mockData';
import { colors, radius } from '../theme';

export function ProfileScreen() {
  return (
    <ScreenShell>
      <View style={styles.topSpacing}>
        <SectionHeader eyebrow="Resident profile" title="Community impact" />
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>RA</Text>
        </View>
        <Text style={styles.profileName}>Rania Amrane</Text>
        <Text style={styles.profileMeta}>Green District, Block 12</Text>
      </View>

      <View style={styles.metricsGrid}>
        {profileMetrics.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.settingsCard}>
        {[
          'Municipality notifications',
          'Household address',
          'Sorting preferences',
        ].map((item) => (
          <View key={item} style={styles.settingsRow}>
            <Text style={styles.settingsText}>{item}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topSpacing: {
    paddingTop: 12,
    marginBottom: 20,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.line,
  },
  profileAvatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
  },
  profileName: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  profileMeta: {
    color: colors.text,
    fontSize: 14,
  },
  metricsGrid: {
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    backgroundColor: '#EBF7F0',
    borderRadius: radius.lg,
    padding: 18,
  },
  metricValue: {
    color: colors.primaryDeep,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  metricLabel: {
    color: colors.text,
    fontSize: 14,
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingHorizontal: 18,
  },
  settingsRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  settingsText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
});
