import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow } from '../../theme';

type SelectionCardProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  selected?: boolean;
  onPress?: () => void;
};

export function SelectionCard({ title, subtitle, icon, selected = false, onPress }: SelectionCardProps) {
  return (
    <Pressable style={[styles.card, selected ? styles.cardSelected : null]} onPress={onPress}>
      <View style={[styles.radio, selected ? styles.radioSelected : null]} />
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 112,
    minHeight: 134,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    paddingTop: 12,
    paddingHorizontal: 10,
    paddingBottom: 14,
    alignItems: 'center',
    ...shadow.card,
  },
  cardSelected: {
    borderColor: '#E2F2E5',
  },
  radio: {
    alignSelf: 'flex-start',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: colors.white,
    marginBottom: 14,
  },
  radioSelected: {
    backgroundColor: '#0E425B',
    borderColor: '#0E425B',
  },
  iconWrap: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#F1AF00',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#30343A',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
});
