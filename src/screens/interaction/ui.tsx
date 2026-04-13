import { type ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../theme";
import { styles } from "./styles";

export function ScreenShell({
  children,
  scroll = false,
  includeTopSafeArea = true,
  withPaddingBottom = true,
}: {
  children: ReactNode;
  scroll?: boolean;
  includeTopSafeArea?: boolean;
  withPaddingBottom?: boolean;
}) {
  if (scroll) {
    return (
      <SafeAreaView
        style={styles.screen}
        edges={includeTopSafeArea ? ["top"] : []}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            withPaddingBottom && { paddingBottom: 120 },
          ]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.screen}
      edges={includeTopSafeArea ? ["top"] : []}
    >
      {children}
    </SafeAreaView>
  );
}

export function HeroHeader({
  title,
  subtitle,
  backLabel,
  onBackPress,
  actionLabel,
  actionIcon,
  onActionPress,
}: {
  title: string;
  subtitle: string;
  backLabel?: string;
  onBackPress?: () => void;
  actionLabel?: string;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  onActionPress?: () => void;
}) {
  return (
    <View style={styles.headerWrap}>
      {(actionLabel || actionIcon) && onActionPress ? (
        <Pressable style={styles.headerAction} onPress={onActionPress}>
          {actionIcon ? (
            <Ionicons name={actionIcon} size={18} color={colors.primaryDeep} />
          ) : null}
          {actionLabel ? (
            <Text style={styles.headerActionText}>{actionLabel}</Text>
          ) : null}
        </Pressable>
      ) : null}
      {backLabel && onBackPress ? (
        <Pressable style={styles.headerAction} onPress={onBackPress}>
          <Text style={styles.headerActionText}>{backLabel}</Text>
        </Pressable>
      ) : null}
      <View style={[styles.headerCopy]}>
        <Text style={[styles.headerTitle]}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

export function ChoiceCard({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.choiceCard, selected && styles.choiceCardActive]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={28}
        color={selected ? colors.primaryDeep : colors.navy}
      />
      <Text style={styles.choiceTitle}>{title}</Text>
      <Text style={styles.choiceSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function InfoBanner({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.infoBanner}>
      <Text style={styles.infoBannerTitle}>{title}</Text>
      <Text style={styles.infoBannerText}>{text}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}
