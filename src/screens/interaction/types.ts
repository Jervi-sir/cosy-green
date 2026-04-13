export type WasteType = 'بلاستيك' | 'خبز' | 'معدن';
export type VenueType = 'House' | 'Restaurant';
export type SubscriptionType = 'Free' | 'Paid';
export type AppRole = 'User' | 'Truck';

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type TruckStop = Coordinate & {
  key: string;
  label: string;
};

export type TrashStatus = 'Waiting' | 'On the way' | 'Arrived' | 'Picked';

export type TrashSignal = {
  id: string;
  wasteTypes: WasteType[];
  note: string;
  address: string;
  coordinate: Coordinate;
  status: TrashStatus;
  createdAt: string;
  qrCode: string;
  scannedAt?: string;
  acceptedByTruck?: boolean;
  acceptedAt?: string;
};

export type TruckProfile = {
  name: string;
  plateNumber: string;
  zone: string;
  pickedCount: number;
  completedTrips: number;
};

export type RequestState = {
  appRole: AppRole;
  subscriptionType: SubscriptionType;
  venueType: VenueType;
  signals: TrashSignal[];
  selectedTruckSignalId?: string;
  wasteTypes: WasteType[];
  note: string;
  address: string;
  coordinate: Coordinate;
  truckStep: number;
  truckEta: string;
  points: number;
  truckProfile: TruckProfile;
};

export type AppFlowContextValue = {
  state: RequestState;
  setAppRole: (value: AppRole) => void;
  setSubscriptionType: (value: SubscriptionType) => void;
  setVenueType: (value: VenueType) => void;
  submitSignal: (payload: { wasteTypes: WasteType[]; note: string; address: string; coordinate: Coordinate }) => void;
  getCurrentSignal: () => TrashSignal | undefined;
  getSelectedTruckSignal: () => TrashSignal | undefined;
  selectTruckSignal: (id: string) => void;
  confirmTruckSignal: (id: string) => void;
  moveTruck: () => void;
  moveTruckBack: () => void;
  scanCurrentSignal: () => void;
  simulateTruckScan: (id: string) => void;
  scanSignalByQrCode: (qrCode: string) => boolean;
  resetApp: () => void;
};
