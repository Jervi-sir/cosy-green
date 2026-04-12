import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow } from '../../theme';

type OptionRowProps = {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
};

export function OptionRow({ icon, label, onPress }: OptionRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>{icon}</View>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 26,
  },
  iconWrap: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    minWidth: 134,
    minHeight: 32,
    borderRadius: radius.pill,
    backgroundColor: '#0CA133',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    ...shadow.card,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
