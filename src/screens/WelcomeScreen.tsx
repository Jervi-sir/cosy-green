import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 1800);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.glowDiamond} />
        <View style={styles.bottomLeftCircle} />
        <View style={styles.bottomRightCircle} />

        <View style={styles.heroBlock}>
          <View style={styles.logoWrap}>
            <View style={styles.speedLines}>
              <View style={[styles.speedLine, styles.speedLineShort]} />
              <View style={styles.speedLine} />
              <View style={[styles.speedLine, styles.speedLineLong]} />
            </View>

            <MaterialCommunityIcons
              name="truck-fast"
              size={124}
              color={colors.primary}
              style={styles.truckIcon}
            />

            <View style={styles.recycleBadge}>
              <MaterialCommunityIcons name="recycle" size={34} color={colors.white} />
            </View>

            <View style={styles.frontSeparator} />
            <View style={styles.wheelOuter}>
              <View style={styles.wheelInner} />
            </View>
          </View>

          <Text style={styles.brand}>easy green</Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowDiamond: {
    position: 'absolute',
    width: 260,
    height: 260,
    backgroundColor: 'rgba(173, 247, 190, 0.58)',
    borderRadius: 34,
    transform: [{ rotate: '-32deg' }],
    bottom: 110,
    left: -72,
    shadowColor: '#B9FFC7',
    shadowOpacity: 0.95,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  bottomLeftCircle: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#97EAB9',
    bottom: -8,
    left: -26,
  },
  bottomRightCircle: {
    position: 'absolute',
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: '#2ACF8F',
    bottom: 64,
    right: -24,
  },
  heroBlock: {
    alignItems: 'center',
    marginBottom: 56,
  },
  logoWrap: {
    width: 210,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedLines: {
    position: 'absolute',
    left: 24,
    top: 67,
    gap: 9,
  },
  speedLine: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.primary,
    width: 46,
  },
  speedLineShort: {
    width: 32,
  },
  speedLineLong: {
    width: 54,
  },
  truckIcon: {
    marginTop: 8,
  },
  recycleBadge: {
    position: 'absolute',
    left: 72,
    top: 34,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontSeparator: {
    position: 'absolute',
    width: 6,
    height: 66,
    backgroundColor: colors.white,
    borderRadius: 999,
    right: 57,
    top: 47,
    transform: [{ rotate: '17deg' }],
  },
  wheelOuter: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2D0A15',
    left: 58,
    bottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F1F0EB',
  },
  brand: {
    marginTop: -6,
    fontSize: 28,
    lineHeight: 32,
    color: '#4D6E4F',
    fontStyle: 'italic',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
