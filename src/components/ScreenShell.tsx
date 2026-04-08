import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';

type ScreenShellProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function ScreenShell({ children, scroll = true }: ScreenShellProps) {
  const content = <View style={styles.content}>{children}</View>;

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.background}>
        <View style={styles.topOrb} />
        <View style={styles.bottomOrb} />
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  background: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  topOrb: {
    position: 'absolute',
    right: -40,
    top: 120,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#D9F7E5',
  },
  bottomOrb: {
    position: 'absolute',
    left: -60,
    bottom: 80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#C5F4DF',
  },
});
