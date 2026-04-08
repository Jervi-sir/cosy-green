import { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { colors, radius, shadow } from '../../theme';

type AppButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'outline';
  children?: ReactNode;
};

export function AppButton({ label, variant = 'primary', style, children, ...props }: AppButtonProps) {
  if (variant === 'outline') {
    return (
      <Pressable style={(state) => mergeStyles(styles.outlineButton, style, state)} {...props}>
        {children ?? <Text style={styles.outlineText}>{label}</Text>}
      </Pressable>
    );
  }

  return (
    <Pressable style={(state) => mergeStyles(styles.primaryButton, style, state)} {...props}>
      <LinearGradient
        colors={['#75B01D', '#66A61D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryFill}
      >
        {children ?? <Text style={styles.primaryText}>{label}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

type SocialIconButtonProps = PressableProps & {
  children: ReactNode;
};

export function SocialIconButton({ children, style, ...props }: SocialIconButtonProps) {
  return (
    <Pressable style={(state) => mergeStyles(styles.socialButton, style, state)} {...props}>
      {children}
    </Pressable>
  );
}

function mergeStyles(
  baseStyle: ViewStyle,
  style: PressableProps['style'],
  state: PressableStateCallbackType,
): StyleProp<ViewStyle> {
  const resolvedStyle = typeof style === 'function' ? style(state) : style;
  return [baseStyle, resolvedStyle];
}

const styles = StyleSheet.create({
  primaryButton: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 18,
    ...shadow.card,
  },
  primaryFill: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  primaryText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  socialButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.pill,
    backgroundColor: '#0F3550',
    borderWidth: 2,
    borderColor: '#03EF53',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    alignSelf: 'center',
    minWidth: 250,
    minHeight: 56,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#0F3550',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: '#0F3550',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
