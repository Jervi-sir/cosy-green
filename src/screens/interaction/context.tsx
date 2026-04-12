import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { etaMap, initialState, truckRoute } from './data';
import { type AppFlowContextValue, type RequestState } from './types';

const AppFlowContext = createContext<AppFlowContextValue | null>(null);

export function useAppFlow() {
  const value = useContext(AppFlowContext);
  if (!value) {
    throw new Error('App flow context is missing');
  }
  return value;
}

export function ConceptProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RequestState>(initialState);

  const value = useMemo<AppFlowContextValue>(
    () => ({
      state,
      setAppRole: (value) => setState((current) => ({ ...current, appRole: value })),
      setSubscriptionType: (value) => setState((current) => ({ ...current, subscriptionType: value })),
      setVenueType: (value) => setState((current) => ({ ...current, venueType: value })),
      submitSignal: ({ wasteTypes, note, address, coordinate }) =>
        setState((current) => ({
          ...current,
          signals: [
            {
              id: `SG-${String(current.signals.length + 1).padStart(3, '0')}`,
              wasteTypes,
              note,
              address,
              coordinate,
              status: 'Waiting',
              createdAt: 'الآن',
              qrCode: `SG${String(current.signals.length + 1).padStart(3, '0')}2048`,
              acceptedByTruck: false,
            },
            ...current.signals,
          ],
          wasteTypes,
          note,
          address,
          coordinate,
          truckStep: 1,
          truckEta: '11:00 صباحاً',
        })),
      getCurrentSignal: () => state.signals[0],
      getSelectedTruckSignal: () => state.signals.find((signal) => signal.id === state.selectedTruckSignalId) ?? state.signals[0],
      selectTruckSignal: (id) => setState((current) => ({ ...current, selectedTruckSignalId: id })),
      confirmTruckSignal: (id) =>
        setState((current) => ({
          ...current,
          selectedTruckSignalId: id,
          signals: current.signals.map((signal) =>
            signal.id === id
              ? {
                  ...signal,
                  acceptedByTruck: true,
                  acceptedAt: 'تم التأكيد للتو',
                }
              : signal,
          ),
        })),
      moveTruck: () =>
        setState((current) => {
          const nextStep = Math.min(current.truckStep + 1, truckRoute.length - 1);
          const nextStatus = nextStep >= truckRoute.length - 1 ? 'Arrived' : 'On the way';
          const activeSignalId = current.selectedTruckSignalId ?? current.signals[0]?.id;
          return {
            ...current,
            signals: current.signals.map((signal, index) =>
              signal.id === activeSignalId || (!activeSignalId && index === 0)
                ? {
                    ...signal,
                    status: nextStatus,
                  }
                : signal,
            ),
            truckStep: nextStep,
            truckEta: etaMap[nextStep],
          };
        }),
      resetApp: () =>
        setState((current) => ({
          ...current,
          appRole: initialState.appRole,
          selectedTruckSignalId: current.selectedTruckSignalId,
        })),
      scanCurrentSignal: () =>
        setState((current) => {
          const currentSignal = current.signals.find((signal) => signal.id === current.selectedTruckSignalId) ?? current.signals[0];
          if (!currentSignal || currentSignal.status !== 'Arrived') {
            return current;
          }

          return {
            ...current,
            points: current.points + 35,
            truckEta: 'تم تأكيد الاستلام',
            signals: current.signals.map((signal, index) =>
              signal.id === currentSignal.id || (!current.selectedTruckSignalId && index === 0)
                ? {
                    ...signal,
                    status: 'Picked',
                    scannedAt: 'تم المسح للتو',
                  }
                : signal,
            ),
          };
        }),
    }),
    [state],
  );

  return <AppFlowContext.Provider value={value}>{children}</AppFlowContext.Provider>;
}
