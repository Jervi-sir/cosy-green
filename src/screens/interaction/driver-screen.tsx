import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { useAppFlow } from './context';
import { mapRegion, truckRoute } from './data';
import { styles } from './styles';
import { DetailRow, HeroHeader, InfoBanner, PrimaryButton, ScreenShell } from './ui';
import { colors } from '../../theme';

export function DriverScreen() {
  const navigation = useNavigation<any>();
  const { state, getCurrentSignal, scanCurrentSignal, resetApp } = useAppFlow();
  const currentSignal = getCurrentSignal();
  const activeTruckCoordinate = truckRoute[Math.min(state.truckStep, truckRoute.length - 1)];

  return (
    <ScreenShell scroll>
      <HeroHeader
        title="سائق الشاحنة"
        subtitle="شاشة ملخص السائق لنفس طلب الاستلام."
        actionLabel="تسجيل الخروج"
        onActionPress={() => {
          resetApp();
          navigation.getParent()?.navigate('Login');
        }}
      />
      <View style={styles.card}>
        <InfoBanner title="الاستلام المعين" text={`${state.venueType === 'House' ? 'منزل' : 'مطعم'} - ${currentSignal?.address ?? state.address}`} />
        <DetailRow label="رقم الإشارة" value={currentSignal?.id ?? 'لا توجد إشارة'} />
        <DetailRow label="نوع النفايات" value={currentSignal ? currentSignal.wasteTypes.join(', ') : state.wasteTypes.join(', ')} />
        <DetailRow label="ملاحظة العميل" value={currentSignal?.note ?? state.note} />
        <DetailRow label="حالة الاستلام" value={currentSignal ? (currentSignal.status === 'Arrived' ? 'وصل' : currentSignal.status === 'Picked' ? 'تم الاستلام' : currentSignal.status === 'Waiting' ? 'قيد الانتظار' : 'في الطريق') : 'بدون حالة'} />
        <DetailRow label="رمز QR" value={currentSignal?.qrCode ?? 'لم يتم الإنشاء'} />
        <DetailRow label="الوقت المتوقع المرسل" value={state.truckEta} />
        <DetailRow label="موقع الشاحنة" value={activeTruckCoordinate.label} />
        {currentSignal?.status === 'Arrived' ? (
          <PrimaryButton label="مسح رمز QR وتأكيد الاستلام" onPress={scanCurrentSignal} />
        ) : null}
        {currentSignal?.status === 'Picked' ? (
          <InfoBanner title="تم الاستلام" text={`تم مسح الرمز${currentSignal.scannedAt ? ` - ${currentSignal.scannedAt}` : ''}`} />
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>قائمة الاستلام</Text>
        {state.signals.map((signal) => (
          <View key={signal.id} style={styles.signalCard}>
            <View style={styles.signalTopRow}>
              <View>
                <Text style={styles.signalId}>{signal.id}</Text>
                <Text style={styles.signalMeta}>{signal.createdAt}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  signal.status === 'Waiting' && styles.statusWaiting,
                  signal.status === 'On the way' && styles.statusOnWay,
                  signal.status === 'Arrived' && styles.statusArrived,
                  signal.status === 'Picked' && styles.statusPicked,
                ]}
              >
                <Text style={styles.statusText}>{signal.status === 'Arrived' ? 'وصل' : signal.status === 'Picked' ? 'تم الاستلام' : signal.status === 'Waiting' ? 'قيد الانتظار' : 'في الطريق'}</Text>
              </View>
            </View>
            <Text style={styles.signalText}>النفايات: {signal.wasteTypes.join(', ')}</Text>
            <Text style={styles.signalText}>الموقع: {signal.address}</Text>
            <Text style={styles.signalText}>ملاحظة: {signal.note}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>خارطة مصغرة للسائق</Text>
        <View style={styles.driverMapCard}>
          <MapView style={styles.mapView} initialRegion={mapRegion}>
            <Polyline
              coordinates={truckRoute.map((point) => ({ latitude: point.latitude, longitude: point.longitude }))}
              strokeColor="#7AA6B8"
              strokeWidth={4}
            />
            <Marker coordinate={currentSignal?.coordinate ?? state.coordinate} title="العميل" pinColor={colors.coral} />
            <Marker
              coordinate={{ latitude: activeTruckCoordinate.latitude, longitude: activeTruckCoordinate.longitude }}
              title="السائق"
            >
              <View style={styles.truckMarker}>
                <MaterialCommunityIcons name="truck-fast" size={18} color={colors.white} />
              </View>
            </Marker>
          </MapView>
        </View>
      </View>
    </ScreenShell>
  );
}
