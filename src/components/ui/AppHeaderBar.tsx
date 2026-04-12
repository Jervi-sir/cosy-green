import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme';

type AppHeaderBarProps = {
  title: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  extraIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onExtraPress?: () => void;
  backgroundColor?: string;
  titleColor?: string;
  iconColor?: string;
  iconBackgroundColor?: string;
};

export function AppHeaderBar({
  title,
  leftIcon = 'menu',
  rightIcon = 'arrow-back',
  extraIcon,
  onLeftPress,
  onRightPress,
  onExtraPress,
  backgroundColor = '#06A117',
  titleColor = colors.white,
  iconColor = '#0A3153',
  iconBackgroundColor = colors.white,
}: AppHeaderBarProps) {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <View style={styles.sideGroup}>
        <Pressable style={[styles.iconButton, { backgroundColor: iconBackgroundColor }]} onPress={onLeftPress}>
          <Ionicons name={leftIcon} size={20} color={iconColor} />
        </Pressable>
      </View>

      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>

      <View style={styles.sideGroupRight}>
        {extraIcon ? (
          <Pressable style={[styles.iconButton, { backgroundColor: iconBackgroundColor }]} onPress={onExtraPress}>
            <Ionicons name={extraIcon} size={18} color="#F6C85F" />
          </Pressable>
        ) : null}
        <Pressable style={[styles.iconButton, { backgroundColor: iconBackgroundColor }]} onPress={onRightPress}>
          <Ionicons name={rightIcon} size={20} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sideGroup: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  sideGroupRight: {
    minWidth: 84,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  iconButton: {
    width: 26,
    height: 26,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
});
