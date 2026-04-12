import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, shadow } from '../../theme';

type DockItem = {
  key: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  active?: boolean;
  onPress?: () => void;
};

type BottomActionDockProps = {
  items: DockItem[];
};

export function BottomActionDock({ items }: BottomActionDockProps) {
  return (
    <View style={styles.dock}>
      {items.map((item, index) => (
        <Pressable key={item.key} style={[styles.item, index < items.length - 1 && styles.divider]} onPress={item.onPress}>
          <MaterialCommunityIcons name={item.icon} size={28} color={item.active ? '#08B12E' : '#08B12E'} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
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
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: '#A8A8A8',
  },
});
