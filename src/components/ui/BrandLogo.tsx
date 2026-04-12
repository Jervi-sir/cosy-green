import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: {
    truck: 58,
    wrapWidth: 88,
    wrapHeight: 62,
    badge: 18,
    badgeIcon: 14,
    badgeLeft: 23,
    badgeTop: 4,
    separatorRight: 26,
    separatorTop: 14,
    separatorHeight: 28,
    wheelLeft: 24,
    wheelBottom: 8,
    wheelSize: 10,
    brandSize: 8,
  },
  md: {
    truck: 86,
    wrapWidth: 132,
    wrapHeight: 92,
    badge: 28,
    badgeIcon: 20,
    badgeLeft: 42,
    badgeTop: 14,
    separatorRight: 40,
    separatorTop: 22,
    separatorHeight: 46,
    wheelLeft: 36,
    wheelBottom: 12,
    wheelSize: 14,
    brandSize: 12,
  },
  lg: {
    truck: 108,
    wrapWidth: 150,
    wrapHeight: 112,
    badge: 38,
    badgeIcon: 26,
    badgeLeft: 46,
    badgeTop: 22,
    separatorRight: 44,
    separatorTop: 24,
    separatorHeight: 54,
    wheelLeft: 38,
    wheelBottom: 12,
    wheelSize: 14,
    brandSize: 16,
  },
} as const;

export function BrandLogo({ size = 'md' }: BrandLogoProps) {
  const scale = sizeMap[size];

  return (
    <View style={styles.logoArea}>
      <View style={[styles.truckWrap, { width: scale.wrapWidth, height: scale.wrapHeight }]}>
        <MaterialCommunityIcons name="truck-fast" size={scale.truck} color="#18B63D" />
        <View
          style={[
            styles.recycleBadge,
            {
              left: scale.badgeLeft,
              top: scale.badgeTop,
              width: scale.badge,
              height: scale.badge,
              borderRadius: scale.badge / 2,
            },
          ]}
        >
          <MaterialCommunityIcons name="recycle" size={scale.badgeIcon} color={colors.white} />
        </View>
        <View
          style={[
            styles.separator,
            {
              right: scale.separatorRight,
              top: scale.separatorTop,
              height: scale.separatorHeight,
            },
          ]}
        />
        <View
          style={[
            styles.wheel,
            {
              left: scale.wheelLeft,
              bottom: scale.wheelBottom,
              width: scale.wheelSize,
              height: scale.wheelSize,
              borderRadius: scale.wheelSize / 2,
            },
          ]}
        />
      </View>
      <Text style={[styles.brand, { fontSize: scale.brandSize }]}>easy green</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoArea: {
    alignItems: 'center',
  },
  truckWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recycleBadge: {
    position: 'absolute',
    backgroundColor: '#15983A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    position: 'absolute',
    width: 3,
    backgroundColor: colors.white,
    borderRadius: 99,
    transform: [{ rotate: '16deg' }],
  },
  wheel: {
    position: 'absolute',
    backgroundColor: '#2C1222',
  },
  brand: {
    marginTop: -2,
    color: '#5C7860',
    fontStyle: 'italic',
    fontWeight: '700',
  },
});
