import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenShell } from '../components/ScreenShell';
import { SectionHeader } from '../components/SectionHeader';
import { recyclingTips } from '../data/mockData';
import { colors, radius } from '../theme';

export function RecyclingScreen() {
  return (
    <ScreenShell>
      <View style={styles.topSpacing}>
        <SectionHeader eyebrow="Education" title="Recycling guide" />
      </View>

      <View style={styles.banner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="sparkles" size={24} color={colors.primaryDeep} />
        </View>
        <View style={styles.bannerCopy}>
          <Text style={styles.bannerTitle}>Your district diverted 2.4 tons this week</Text>
          <Text style={styles.bannerText}>Small sorting habits improve collection routes and lower overflow.</Text>
        </View>
      </View>

      {recyclingTips.map((tip) => (
        <View key={tip.title} style={styles.tipCard}>
          <View style={[styles.tipAccent, { backgroundColor: tip.accent }]} />
          <View style={styles.tipCopy}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipBody}>{tip.body}</Text>
          </View>
        </View>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topSpacing: {
    paddingTop: 12,
    marginBottom: 20,
  },
  banner: {
    backgroundColor: '#E3F8EE',
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 18,
    flexDirection: 'row',
    gap: 16,
  },
  bannerIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerCopy: {
    flex: 1,
  },
  bannerTitle: {
    color: colors.ink,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  bannerText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tipAccent: {
    width: 8,
    borderRadius: radius.pill,
  },
  tipCopy: {
    flex: 1,
  },
  tipTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  tipBody: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
