import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radius, shadow } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const fields = [
  'الأسم و اللقب',
  'الولاية',
  'البلدية',
  'الحي',
  'رقم الباب',
  'العمارة',
  'الطابق',
  'اسم المحل',
];

export function RegisterScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.shape, styles.leftGreen]} />
        <View style={[styles.shape, styles.rightGreen]} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.title}>SignUp</Text>

            {fields.map((placeholder) => (
              <TextInput
                key={placeholder}
                placeholder={placeholder}
                placeholderTextColor="#666666"
                style={styles.lineInput}
                textAlign="right"
              />
            ))}

            <Pressable style={styles.locationButton}>
              <Ionicons name="location" size={46} color="#E54B4B" />
              <Ionicons name="map" size={34} color="#F4C433" style={styles.mapIcon} />
              <Text style={styles.locationText}>تحديد الموقع</Text>
            </Pressable>
          </View>
        </ScrollView>

        <Pressable style={styles.nextButton} onPress={() => navigation.replace('MainTabs')}>
          <View style={styles.arrowBadge}>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </View>
          <Text style={styles.nextText}>التالي</Text>
        </Pressable>
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
  },
  shape: {
    position: 'absolute',
    width: 116,
    height: 210,
    top: 284,
    backgroundColor: '#11B65F',
  },
  leftGreen: {
    left: -58,
    transform: [{ skewY: '-40deg' }],
  },
  rightGreen: {
    right: -58,
    transform: [{ skewY: '40deg' }],
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 170,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 34,
    borderWidth: 1,
    borderColor: '#ECECEC',
    ...shadow.card,
  },
  title: {
    textAlign: 'center',
    color: '#32347C',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  lineInput: {
    minHeight: 43,
    borderBottomWidth: 1,
    borderBottomColor: '#B6B6B6',
    color: colors.ink,
    fontSize: 16,
    marginBottom: 1,
    paddingHorizontal: 2,
    writingDirection: 'rtl',
  },
  locationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  mapIcon: {
    marginTop: -10,
    color: '#3EBCFF',
  },
  locationText: {
    marginTop: 4,
    fontSize: 18,
    color: '#222222',
  },
  nextButton: {
    alignSelf: 'center',
    width: '66%',
    minHeight: 56,
    marginBottom: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#0F3550',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  arrowBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F3550',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: '#656565',
    fontSize: 24,
    fontWeight: '800',
  },
});
