import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import {
  apiRequest,
  clearTokens,
  getRefreshToken,
  hydrateTokens,
  persistTokens,
} from "@/lib/api";
import { registerDevicePushToken } from "@/lib/push-notifications";
import { etaMap, initialState, truckRoute } from "./data";
import {
  type AppFlowContextValue,
  type AppRole,
  type Coordinate,
  type RequestState,
  type SubscriptionType,
  type TrashSignal,
  type TrashStatus,
  type VenueType,
  type WasteType,
} from "./types";

type ServerSignal = {
  id: string;
  publicId: string;
  wasteTypes: string[];
  note: string;
  address: string;
  coordinate: Coordinate;
  status: "WAITING" | "CONFIRMED" | "ARRIVING" | "ARRIVED" | "PICKED" | "CANCELLED";
  qrCode: string;
  qrUnlocked: boolean;
  acceptedByTruck: boolean;
  acceptedAt?: string | null;
  scannedAt?: string | null;
  createdAt: string;
  truck?: {
    id: string;
    name: string;
    plateNumber: string;
    zone: string;
  } | null;
};

type ServerUser = {
  id: string;
  email: string;
  fullName: string;
  role: "USER" | "TRUCK";
  venueType: "HOUSE" | "RESTAURANT" | null;
  points: number;
  truck: {
    id: string;
    name: string;
    plateNumber: string;
    zone: string;
  } | null;
};

const AppFlowContext = createContext<AppFlowContextValue | null>(null);

export function useAppFlow() {
  const value = useContext(AppFlowContext);
  if (!value) {
    throw new Error("App flow context is missing");
  }
  return value;
}

function formatDate(value?: string | null) {
  if (!value) {
    return undefined;
  }

  return new Date(value).toLocaleString("ar-DZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function mapRole(role: ServerUser["role"]): AppRole {
  return role === "TRUCK" ? "Truck" : "User";
}

function mapVenueType(venueType: ServerUser["venueType"]): VenueType {
  return venueType === "RESTAURANT" ? "Restaurant" : "House";
}

function mapSubscriptionType(plan?: "FREE" | "PAID" | null): SubscriptionType {
  return plan === "PAID" ? "Paid" : "Free";
}

function mapStatus(status: ServerSignal["status"]): TrashStatus {
  if (status === "ARRIVED") {
    return "Arrived";
  }
  if (status === "PICKED") {
    return "Picked";
  }
  if (status === "CANCELLED") {
    return "Cancelled";
  }
  if (status === "CONFIRMED" || status === "ARRIVING") {
    return "On the way";
  }
  return "Waiting";
}

function mapSignal(signal: ServerSignal): TrashSignal {
  return {
    backendId: signal.id,
    id: signal.publicId,
    wasteTypes: signal.wasteTypes as WasteType[],
    note: signal.note,
    address: signal.address,
    coordinate: signal.coordinate,
    status: mapStatus(signal.status),
    createdAt: formatDate(signal.createdAt) ?? "الآن",
    qrCode: signal.qrCode,
    qrUnlocked: signal.qrUnlocked,
    scannedAt: formatDate(signal.scannedAt),
    acceptedByTruck: signal.acceptedByTruck,
    acceptedAt: formatDate(signal.acceptedAt),
    truck: signal.truck,
  };
}

function pickDefaultSignal(signals: TrashSignal[], selectedId?: string) {
  return signals.find((signal) => signal.backendId === selectedId) ?? signals[0];
}

async function fetchUserState(current: RequestState): Promise<Partial<RequestState>> {
  const [{ user, subscription }, { items }, { points }, live] = await Promise.all([
    apiRequest<{ user: ServerUser; subscription?: { plan: "FREE" | "PAID" } | null }>("/me"),
    apiRequest<{ items: ServerSignal[] }>("/trash-signals?mine=true"),
    apiRequest<{ userId: string; points: number }>("/rewards/points"),
    apiRequest<{ routeStep?: number }>("/truck/location/live"),
  ]);

  const signals = items.map(mapSignal);
  const activeSignal = pickDefaultSignal(signals, current.selectedTruckSignalId);
  const routeStep = Math.max(0, Math.min(live.routeStep ?? current.truckStep, truckRoute.length - 1));

  return {
    isAuthenticated: true,
    isBootstrapping: false,
    appRole: "User",
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    subscriptionType: mapSubscriptionType(subscription?.plan),
    venueType: mapVenueType(user.venueType),
    points,
    signals,
    selectedTruckSignalId: activeSignal?.backendId,
    wasteTypes: activeSignal?.wasteTypes ?? current.wasteTypes,
    note: activeSignal?.note ?? current.note,
    address: activeSignal?.address ?? current.address,
    coordinate: activeSignal?.coordinate ?? current.coordinate,
    truckStep: routeStep,
    truckEta: etaMap[routeStep] ?? current.truckEta,
    truckProfile: activeSignal?.truck
      ? {
          id: activeSignal.truck.id,
          name: activeSignal.truck.name,
          plateNumber: activeSignal.truck.plateNumber,
          zone: activeSignal.truck.zone,
          pickedCount: current.truckProfile.pickedCount,
          completedTrips: current.truckProfile.completedTrips,
        }
      : current.truckProfile,
  };
}

async function fetchTruckState(current: RequestState): Promise<Partial<RequestState>> {
  const [{ user }, profile, stats, newSignals, confirmedSignals, route] = await Promise.all([
    apiRequest<{ user: ServerUser }>("/me"),
    apiRequest<{ id: string; name: string; plateNumber: string; zone: string }>("/truck/profile"),
    apiRequest<{
      pickedCount: number;
      completedTrips: number;
      waitingCount: number;
      confirmedCount: number;
      onTheWayCount: number;
      arrivedCount: number;
      pickedActiveCount: number;
    }>("/truck/stats"),
    apiRequest<{ items: ServerSignal[] }>("/truck/signals/new"),
    apiRequest<{ items: ServerSignal[] }>("/truck/signals/confirmed"),
    apiRequest<{
      truck: { currentRouteStep: number };
      route: Array<{ key: string; label: string; latitude: number; longitude: number }>;
      activePickupIds: string[];
    }>("/truck/route/current"),
  ]);

  const signalMap = new Map<string, TrashSignal>();
  [...newSignals.items, ...confirmedSignals.items].forEach((signal) => {
    signalMap.set(signal.id, mapSignal(signal));
  });
  const signals = [...signalMap.values()];
  const activeSignal = pickDefaultSignal(signals, current.selectedTruckSignalId);
  const routeStep = Math.max(0, Math.min(route.truck.currentRouteStep, truckRoute.length - 1));

  return {
    isAuthenticated: true,
    isBootstrapping: false,
    appRole: "Truck",
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    signals,
    selectedTruckSignalId: activeSignal?.backendId,
    wasteTypes: activeSignal?.wasteTypes ?? current.wasteTypes,
    note: activeSignal?.note ?? current.note,
    address: activeSignal?.address ?? current.address,
    coordinate: activeSignal?.coordinate ?? current.coordinate,
    truckStep: routeStep,
    truckEta: etaMap[routeStep] ?? current.truckEta,
    truckProfile: {
      id: profile.id,
      name: profile.name,
      plateNumber: profile.plateNumber,
      zone: profile.zone,
      pickedCount: stats.pickedCount,
      completedTrips: stats.completedTrips,
    },
  };
}

export function ConceptProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RequestState>(initialState);

  const value = useMemo<AppFlowContextValue>(
    () => ({
      state,
      bootstrap: async () => {
        setState((current) => ({ ...current, isBootstrapping: true }));
        try {
          const tokens = await hydrateTokens();
          if (!tokens.accessToken) {
            setState((current) => ({ ...current, isBootstrapping: false }));
            return "ModeSelect";
          }

          const me = await apiRequest<{ user: ServerUser }>("/me");
          registerDevicePushToken().catch(() => {
            // ignore push registration failures during bootstrap
          });
          const nextRole = mapRole(me.user.role);
          const nextPartial =
            nextRole === "Truck"
              ? await fetchTruckState({ ...state, appRole: "Truck" })
              : await fetchUserState({ ...state, appRole: "User" });

          setState((current) => ({ ...current, ...nextPartial }));
          return nextRole === "Truck" ? "TruckApp" : "UserApp";
        } catch {
          await clearTokens();
          setState({ ...initialState, isBootstrapping: false });
          return "ModeSelect";
        }
      },
      login: async (email, password) => {
        const response = await apiRequest<{
          accessToken: string;
          refreshToken: string;
          role: ServerUser["role"];
          user: ServerUser;
        }>("/auth/login", {
          auth: false,
          body: { email, password },
        });
        await persistTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        registerDevicePushToken().catch(() => {
          // ignore push registration failures after login
        });

        const nextRole = mapRole(response.role);
        setState((current) => ({
          ...current,
          isAuthenticated: true,
          isBootstrapping: false,
          appRole: nextRole,
          userId: response.user.id,
          fullName: response.user.fullName,
          email: response.user.email,
          venueType: mapVenueType(response.user.venueType),
          points: response.user.points,
          truckProfile: response.user.truck
            ? {
                id: response.user.truck.id,
                name: response.user.truck.name,
                plateNumber: response.user.truck.plateNumber,
                zone: response.user.truck.zone,
                pickedCount: current.truckProfile.pickedCount,
                completedTrips: current.truckProfile.completedTrips,
              }
            : current.truckProfile,
        }));

        const refreshPromise =
          nextRole === "Truck"
            ? fetchTruckState({ ...state, appRole: "Truck" })
            : fetchUserState({ ...state, appRole: "User" });

        refreshPromise
          .then((nextPartial) => {
            setState((current) => ({ ...current, ...nextPartial, appRole: nextRole }));
          })
          .catch(() => {
            // keep minimal authenticated state even if follow-up hydration fails
          });

        if (nextRole === "Truck") {
          return "TruckApp";
        }

        const shouldOnboard = !response.user.venueType;
        return shouldOnboard ? "Subscription" : "UserApp";
      },
      register: async ({ fullName, email, password, truckName, plateNumber, zone }) => {
        const response = await apiRequest<{
          accessToken: string;
          refreshToken: string;
          role: ServerUser["role"];
          user: ServerUser;
        }>("/auth/register", {
          auth: false,
          body: {
            fullName,
            email,
            password,
            role: state.appRole === "Truck" ? "TRUCK" : "USER",
            truckName,
            plateNumber,
            zone,
          },
        });

        await persistTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        registerDevicePushToken().catch(() => {
          // ignore push registration failures after register
        });

        const nextRole = mapRole(response.role);
        setState((current) => ({
          ...current,
          isAuthenticated: true,
          isBootstrapping: false,
          appRole: nextRole,
          userId: response.user.id,
          fullName: response.user.fullName,
          email: response.user.email,
          venueType: mapVenueType(response.user.venueType),
          points: response.user.points,
          truckProfile: response.user.truck
            ? {
                id: response.user.truck.id,
                name: response.user.truck.name,
                plateNumber: response.user.truck.plateNumber,
                zone: response.user.truck.zone,
                pickedCount: current.truckProfile.pickedCount,
                completedTrips: current.truckProfile.completedTrips,
              }
            : current.truckProfile,
        }));

        const refreshPromise =
          nextRole === "Truck"
            ? fetchTruckState({ ...state, appRole: "Truck" })
            : fetchUserState({ ...state, appRole: "User" });

        refreshPromise
          .then((nextPartial) => {
            setState((current) => ({ ...current, ...nextPartial, appRole: nextRole }));
          })
          .catch(() => {
            // keep minimal authenticated state even if follow-up hydration fails
          });

        return nextRole === "Truck" ? "TruckApp" : "Subscription";
      },
      setAppRole: (value) => setState((current) => ({ ...current, appRole: value })),
      setSubscriptionType: (value) =>
        setState((current) => ({ ...current, subscriptionType: value })),
      setVenueType: (value) => setState((current) => ({ ...current, venueType: value })),
      completeFreePlanSetup: async () => {
        await apiRequest("/subscriptions/select", {
          body: {
            planId: "free",
            venueType: state.venueType === "House" ? "HOUSE" : "RESTAURANT",
          },
        });
        const nextPartial = await fetchUserState(state);
        setState((current) => ({ ...current, ...nextPartial }));
      },
      completePaidPlanSetup: async () => {
        await apiRequest("/subscriptions/select", {
          body: {
            planId: "paid",
            venueType: state.venueType === "House" ? "HOUSE" : "RESTAURANT",
          },
        });
        const intent = await apiRequest<{ paymentIntentId: string }>("/payments/intent", {
          body: {
            planId: "paid",
            paymentMethod: "card_4242",
          },
        });
        await apiRequest("/payments/confirm", {
          body: { paymentIntentId: intent.paymentIntentId },
        });
        const nextPartial = await fetchUserState(state);
        setState((current) => ({ ...current, ...nextPartial, subscriptionType: "Paid" }));
      },
      submitSignal: async ({ wasteTypes, note, address, coordinate }) => {
        await apiRequest("/trash-signals", {
          body: {
            wasteTypes,
            note,
            address,
            coordinate,
          },
        });
        const nextPartial = await fetchUserState(state);
        setState((current) => ({ ...current, ...nextPartial }));
      },
      getCurrentSignal: () => state.signals[0],
      getSelectedTruckSignal: () =>
        state.signals.find((signal) => signal.backendId === state.selectedTruckSignalId) ??
        state.signals[0],
      selectTruckSignal: (backendId) =>
        setState((current) => ({ ...current, selectedTruckSignalId: backendId })),
      confirmTruckSignal: async (backendId) => {
        await apiRequest(`/truck/signals/${backendId}/confirm`, { body: {} });
        const nextPartial = await fetchTruckState({ ...state, selectedTruckSignalId: backendId });
        setState((current) => ({ ...current, ...nextPartial, selectedTruckSignalId: backendId }));
      },
      moveTruck: async () => {
        const nextStep = Math.min(state.truckStep + 1, truckRoute.length - 1);
        const point = truckRoute[nextStep];
        await apiRequest("/truck/location", {
          body: {
            latitude: point.latitude,
            longitude: point.longitude,
            routeStep: nextStep,
            recordedAt: new Date().toISOString(),
          },
        });
        const nextPartial = await fetchTruckState({ ...state, truckStep: nextStep });
        setState((current) => ({ ...current, ...nextPartial }));
      },
      moveTruckBack: async () => {
        const previousStep = Math.max(state.truckStep - 1, 0);
        const point = truckRoute[previousStep];
        await apiRequest("/truck/location", {
          body: {
            latitude: point.latitude,
            longitude: point.longitude,
            routeStep: previousStep,
            recordedAt: new Date().toISOString(),
          },
        });
        const nextPartial = await fetchTruckState({ ...state, truckStep: previousStep });
        setState((current) => ({ ...current, ...nextPartial }));
      },
      scanCurrentSignal: async () => {
        const signal =
          state.signals.find((entry) => entry.backendId === state.selectedTruckSignalId) ??
          state.signals[0];
        if (!signal) {
          return;
        }

        await apiRequest("/truck/scan", {
          body: {
            signalId: signal.backendId,
            qrCode: signal.qrCode,
            scannedAt: new Date().toISOString(),
          },
        });
        const nextPartial = await fetchTruckState({ ...state, selectedTruckSignalId: signal.backendId });
        setState((current) => ({ ...current, ...nextPartial }));
      },
      simulateTruckScan: async (backendId) => {
        await apiRequest(`/trash-signals/${backendId}/simulate-scan`, { body: {} });
        const nextPartial =
          state.appRole === "Truck"
            ? await fetchTruckState({ ...state, selectedTruckSignalId: backendId })
            : await fetchUserState({ ...state, selectedTruckSignalId: backendId });
        setState((current) => ({ ...current, ...nextPartial }));
      },
      scanSignalByQrCode: async (qrCode) => {
        const signal =
          state.signals.find((entry) => entry.qrCode === qrCode.trim()) ??
          state.signals.find((entry) => entry.backendId === state.selectedTruckSignalId);
        if (!signal) {
          return false;
        }

        try {
          await apiRequest("/truck/scan", {
            body: {
              signalId: signal.backendId,
              qrCode: qrCode.trim(),
              scannedAt: new Date().toISOString(),
            },
          });
          const nextPartial = await fetchTruckState({ ...state, selectedTruckSignalId: signal.backendId });
          setState((current) => ({ ...current, ...nextPartial }));
          return true;
        } catch {
          return false;
        }
      },
      refreshData: async () => {
        const nextPartial =
          state.appRole === "Truck"
            ? await fetchTruckState(state)
            : await fetchUserState(state);
        setState((current) => ({ ...current, ...nextPartial }));
      },
      resetApp: async () => {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            await apiRequest("/auth/logout", {
              auth: false,
              body: { refreshToken },
            });
          } catch {
            // ignore logout failures during local reset
          }
        }
        await clearTokens();
        setState({ ...initialState, isBootstrapping: false });
      },
    }),
    [state],
  );

  return <AppFlowContext.Provider value={value}>{children}</AppFlowContext.Provider>;
}
