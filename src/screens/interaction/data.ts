import { type Region } from 'react-native-maps';

import { type RequestState, type TruckStop, type WasteType } from './types';

export const wasteOptions: WasteType[] = ['بلاستيك', 'خبز', 'معدن'];

export const truckRoute: TruckStop[] = [
  { key: 'depot', label: 'مستودع الشاحنات', latitude: 36.7525, longitude: 3.042 },
  { key: 'center', label: 'الطريق المركزي', latitude: 36.7483, longitude: 3.0514 },
  { key: 'market', label: 'منعطف السوق', latitude: 36.7449, longitude: 3.0611 },
  { key: 'street', label: 'شارعك', latitude: 36.7408, longitude: 3.0697 },
  { key: 'pickup', label: 'نقطة الاستلام', latitude: 36.7379, longitude: 3.0748 },
];

export const defaultCoordinate = { latitude: 36.7379, longitude: 3.0748 };

export const mapRegion: Region = {
  latitude: 36.7448,
  longitude: 3.0595,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export const initialState: RequestState = {
  appRole: 'User',
  subscriptionType: 'Free',
  venueType: 'House',
  signals: [
    {
      id: 'SG-001',
      wasteTypes: ['بلاستيك'],
      note: 'الأكياس جاهزة عند المدخل.',
      address: '12 شارع النخيل، الحي الأخضر',
      coordinate: defaultCoordinate,
      status: 'On the way',
      createdAt: 'اليوم، 10:05 صباحاً',
      qrCode: 'SG0012048',
      acceptedByTruck: true,
      acceptedAt: 'اليوم، 10:10 صباحاً',
    },
  ],
  selectedTruckSignalId: 'SG-001',
  wasteTypes: ['بلاستيك'],
  note: 'الأكياس جاهزة عند المدخل.',
  address: '12 شارع النخيل، الحي الأخضر',
  coordinate: defaultCoordinate,
  truckStep: 1,
  truckEta: '11:00 صباحاً',
  points: 125,
};

export const etaMap = ['11:00 صباحاً', '10:45 صباحاً', '10:30 صباحاً', '10:15 صباحاً', 'وصل'];
