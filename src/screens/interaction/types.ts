export type WasteType = "بلاستيك" | "خبز" | "معدن";
export type VenueType = "House" | "Restaurant";
export type SubscriptionType = "Free" | "Paid";
export type AppRole = "User" | "Truck";
export type TrashStatus = "Waiting" | "On the way" | "Arrived" | "Picked" | "Cancelled";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type TruckStop = Coordinate & {
  key: string;
  label: string;
};

export type TruckSummary = {
  id: string;
  name: string;
  plateNumber: string;
  zone: string;
};

export type TrashSignal = {
  backendId: string;
  id: string;
  wasteTypes: WasteType[];
  note: string;
  address: string;
  coordinate: Coordinate;
  status: TrashStatus;
  createdAt: string;
  qrCode: string;
  qrUnlocked?: boolean;
  scannedAt?: string;
  acceptedByTruck?: boolean;
  acceptedAt?: string;
  truck?: TruckSummary | null;
};

export type TruckProfile = {
  id?: string;
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
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  userId?: string;
  fullName?: string;
  email?: string;
};

export type AppFlowContextValue = {
  state: RequestState;
  bootstrap: () => Promise<"ModeSelect" | "UserApp" | "TruckApp">;
  login: (email: string, password: string) => Promise<"Subscription" | "UserApp" | "TruckApp">;
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
    truckName?: string;
    plateNumber?: string;
    zone?: string;
  }) => Promise<"Subscription" | "UserApp" | "TruckApp">;
  setAppRole: (value: AppRole) => void;
  setSubscriptionType: (value: SubscriptionType) => void;
  setVenueType: (value: VenueType) => void;
  completeFreePlanSetup: () => Promise<void>;
  completePaidPlanSetup: () => Promise<void>;
  submitSignal: (payload: {
    wasteTypes: WasteType[];
    note: string;
    address: string;
    coordinate: Coordinate;
  }) => Promise<void>;
  getCurrentSignal: () => TrashSignal | undefined;
  getSelectedTruckSignal: () => TrashSignal | undefined;
  selectTruckSignal: (backendId: string) => void;
  confirmTruckSignal: (backendId: string) => Promise<void>;
  moveTruck: () => Promise<void>;
  moveTruckBack: () => Promise<void>;
  scanCurrentSignal: () => Promise<void>;
  simulateTruckScan: (backendId: string) => Promise<void>;
  scanSignalByQrCode: (qrCode: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  resetApp: () => Promise<void>;
};
