import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { type RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme';
import { styles } from './styles';

export function LoadingScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Loading'>) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), 1400);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.loadingScreen}>
      <View style={styles.loadingBadge}>
        <MaterialCommunityIcons name="recycle" size={42} color={colors.white} />
      </View>
      <Text style={styles.loadingTitle}>كوست جرين</Text>
      <Text style={styles.loadingText}>جاري تحضير تجربة الاستلام وتتبع الشاحنة والمكافآت.</Text>
    </SafeAreaView>
  );
}
