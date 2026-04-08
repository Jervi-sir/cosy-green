import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenShell } from '../components/ScreenShell';
import { SectionHeader } from '../components/SectionHeader';
import { requests } from '../data/mockData';
import { colors, radius, shadow } from '../theme';

export function RequestsScreen() {
  return (
    <ScreenShell>
      <View style={styles.topSpacing}>
        <SectionHeader eyebrow="Citizen cases" title="Requests and follow-up" />
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Open tickets</Text>
          <Text style={styles.summaryValue}>03 active requests</Text>
        </View>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryPillText}>Response avg. 24 min</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <View style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={styles.filterChipActiveText}>All</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>Scheduled</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>Resolved</Text>
        </View>
      </View>

      {requests.map((request, index) => (
        <Pressable key={request.id} style={styles.requestCard}>
          <View style={styles.requestHead}>
            <View style={[styles.requestIcon, { backgroundColor: index === 0 ? '#D4F6E2' : '#FFF3D5' }]}>
              <Ionicons name={index === 0 ? 'trash-bin-outline' : 'cube-outline'} size={20} color={colors.primaryDeep} />
            </View>
            <View style={styles.requestCopy}>
              <Text style={styles.requestTitle}>{request.title}</Text>
              <Text style={styles.requestId}>{request.id}</Text>
            </View>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.muted} />
          </View>

          <View style={styles.requestMetaRow}>
            <View>
              <Text style={styles.metaLabel}>Current status</Text>
              <Text style={styles.metaValue}>{request.status}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>ETA</Text>
              <Text style={styles.metaValue}>{request.eta}</Text>
            </View>
          </View>

          <View style={styles.inlineProgressTrack}>
            <View style={[styles.inlineProgressFill, { width: `${request.progress * 100}%` }]} />
          </View>
        </Pressable>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topSpacing: {
    paddingTop: 12,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 18,
    ...shadow.card,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    marginBottom: 8,
  },
  summaryValue: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 16,
  },
  summaryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  summaryPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    color: colors.text,
    fontWeight: '700',
  },
  filterChipActiveText: {
    color: colors.white,
    fontWeight: '800',
  },
  requestCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  requestHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  requestIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestCopy: {
    flex: 1,
  },
  requestTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  requestId: {
    color: colors.muted,
    fontSize: 13,
  },
  requestMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  metaValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  inlineProgressTrack: {
    height: 8,
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  inlineProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
});
