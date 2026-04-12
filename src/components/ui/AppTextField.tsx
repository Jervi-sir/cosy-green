import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { colors, radius } from '../../theme';

type AppTextFieldProps = TextInputProps & {
  leading?: ReactNode;
  rtl?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export function AppTextField({ leading, rtl = false, style, containerStyle, ...props }: AppTextFieldProps) {
  return (
    <View style={[styles.shell, containerStyle]}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <TextInput
        placeholderTextColor="#A6A6A6"
        style={[styles.input, rtl ? styles.rtlInput : null, style]}
        textAlign={rtl ? 'right' : props.textAlign}
        {...props}
      />
    </View>
  );
}

export function InputBadge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 48,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    backgroundColor: '#FCFCFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#D9D9D9',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  leading: {
    marginEnd: 12,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D0D0D0',
    shadowOpacity: 0.28,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  badgeLabel: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
  },
  rtlInput: {
    writingDirection: 'rtl',
  },
});
