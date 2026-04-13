# App API Requirements Skill

Use this skill when the user asks for backend/API planning, endpoint design, service contracts, or implementation requirements for the `cost-green` app.

## Purpose

Translate the current mobile flows into a complete backend API checklist so an engineer can build the services needed for the app to work end to end.

## App Flows Covered

- User authentication and role selection
- Subscription selection and payment
- Account type selection (`House` / `Restaurant`)
- Create trash signal with map location and waste types
- User signal list and signal details
- Truck queue for new and confirmed pickups
- Truck confirmation flow
- Truck route / live location tracking
- QR code unlock and QR scan pickup confirmation
- User points / rewards
- Truck profile and truck pickup stats

## Required Core Entities

- `User`
- `TruckDriver`
- `Truck`
- `Subscription`
- `Payment`
- `TrashSignal`
- `PickupAssignment`
- `QrScanEvent`
- `RewardTransaction`
- `TruckLocationPing`

## Canonical Trash Status Flow

The backend should enforce this lifecycle:

1. `WAITING` - client created the signal
2. `CONFIRMED` - truck accepted the pickup request
3. `ARRIVING` - truck is moving toward the request
4. `ARRIVED` - truck is close enough and QR can be scanned
5. `PICKED` - QR scanned successfully, pickup completed
6. `CANCELLED` - optional failure/cancel state

Notes:

- QR becomes visible to the client after truck confirmation
- client points are granted only after `PICKED`
- truck stats are incremented only after `PICKED`

## Required APIs

### 1. Auth APIs

#### `POST /auth/login`
- input: `email`, `password`
- output: `accessToken`, `refreshToken`, `user`, `role`

#### `POST /auth/refresh`
- input: `refreshToken`
- output: new tokens

#### `POST /auth/logout`
- input: current token/session id

#### `GET /me`
- returns current account, role, subscription, venue type, points summary

### 2. Subscription and Payment APIs

#### `GET /subscriptions/plans`
- returns free/paid plans with price, features, billing cycle

#### `POST /subscriptions/select`
- input: `planId`, `venueType`
- output: selected subscription state

#### `POST /payments/intent`
- input: `planId`, `paymentMethod`
- output: payment intent / checkout payload

#### `POST /payments/confirm`
- input: `paymentIntentId`
- output: payment result, subscription activation

#### `GET /payments/history`
- returns payment records for the account

### 3. User Profile / App Setup APIs

#### `PATCH /me/profile`
- input: `venueType`, optional profile fields
- output: updated user profile

#### `GET /me/dashboard`
- returns compact user summary for app boot:
  - current subscription
  - venue type
  - points
  - active signals
  - latest truck ETA

### 4. Trash Signal APIs

#### `POST /trash-signals`
- input:
  - `wasteTypes[]`
  - `note`
  - `address`
  - `coordinate { latitude, longitude }`
- output:
  - created signal
  - initial status `WAITING`
  - generated QR code value

#### `GET /trash-signals`
- query:
  - `status`
  - `mine=true`
  - pagination
- output: list of signals

#### `GET /trash-signals/:signalId`
- returns full details for one signal

#### `PATCH /trash-signals/:signalId`
- optional edits before confirmation: note, address, coordinate, waste types

#### `DELETE /trash-signals/:signalId`
- optional cancel/delete before truck pickup is confirmed

### 5. Truck Dispatch / Assignment APIs

#### `GET /truck/signals/new`
- returns unconfirmed signals available to the truck or the truck zone

#### `GET /truck/signals/confirmed`
- returns confirmed/assigned signals for the truck

#### `POST /truck/signals/:signalId/confirm`
- truck confirms it will pick up the signal
- output:
  - status becomes `CONFIRMED` or `ARRIVING`
  - `acceptedAt`
  - assigned truck info
  - QR unlock flag for client

#### `POST /truck/signals/:signalId/unassign`
- optional rollback if assignment is removed

### 6. Truck Route / Tracking APIs

#### `GET /truck/route/current`
- returns truck route points, current step/index, ETA, active pickup ids

#### `POST /truck/location`
- input:
  - `truckId`
  - `latitude`
  - `longitude`
  - `heading`
  - `speed`
  - `recordedAt`

#### `GET /truck/location/live`
- returns latest truck location and ETA for user-facing tracking screen

#### `POST /truck/signals/:signalId/arrive`
- marks truck as arrived/close enough to the pickup
- unlocks scan-ready state

Important:

- in production, `ARRIVED` should be derived by geofencing or dispatch logic, not manual UI buttons

### 7. QR Code / Pickup Completion APIs

#### `GET /trash-signals/:signalId/qr`
- returns QR metadata only if the signal is confirmed
- fields:
  - `qrCode`
  - `isUnlocked`
  - `expiresAt` optional

#### `POST /truck/scan`
- input:
  - `signalId` optional
  - `qrCode`
  - `scannedAt`
  - `truckId`
- validation:
  - QR matches signal
  - signal belongs to truck or assigned zone
  - signal status is `ARRIVED`
- output:
  - signal becomes `PICKED`
  - pickup confirmation payload
  - points awarded
  - updated truck stats

#### `GET /truck/scans/history`
- returns prior QR scan events

### 8. Points / Rewards APIs

#### `GET /rewards/points`
- returns current point balance and summary

#### `GET /rewards/transactions`
- returns points history with reasons like pickup completed

#### `POST /rewards/apply-pickup-points`
- optional internal/admin endpoint if points are not granted inline during scan

Recommended behavior:

- normally, award points atomically inside `POST /truck/scan`

### 9. Truck Profile / Stats APIs

#### `GET /truck/profile`
- returns:
  - truck name
  - plate number
  - zone
  - driver name optional

#### `GET /truck/stats`
- returns:
  - picked count
  - completed trips
  - waiting count
  - on-the-way count
  - arrived count
  - picked count for active period

### 10. Optional Realtime APIs

If live tracking is required, add one of:

- WebSocket `/ws/tracking`
- SSE `/events/tracking`
- Pusher/Ably/Firebase channels

Realtime topics should include:

- signal status updated
- truck location updated
- truck confirmed pickup
- truck arrived
- pickup completed
- points updated

## Minimum Response Shapes

### `TrashSignal`

```json
{
  "id": "SG-001",
  "wasteTypes": ["Plastic"],
  "note": "Bags ready at the entrance",
  "address": "Ain El Turk road, Oran",
  "coordinate": {
    "latitude": 35.6911,
    "longitude": -0.6204
  },
  "status": "ARRIVED",
  "qrCode": "SG0012048",
  "acceptedByTruck": true,
  "acceptedAt": "2026-04-13T12:10:00Z",
  "scannedAt": null,
  "truck": {
    "id": "TR-01",
    "name": "Oran Truck 1"
  }
}
```

### `TruckProfile`

```json
{
  "id": "TR-01",
  "name": "Oran Truck 1",
  "plateNumber": "21345-118-16",
  "zone": "Oran West",
  "stats": {
    "pickedCount": 18,
    "completedTrips": 6,
    "waitingCount": 4,
    "onTheWayCount": 2,
    "arrivedCount": 1
  }
}
```

## Backend Rules The AI Should Preserve

- A signal cannot be scanned before truck confirmation
- A signal cannot be scanned unless it is in `ARRIVED`
- A signal cannot grant points twice
- A signal cannot increment truck stats twice
- A truck should only confirm/scan signals it is assigned to
- QR unlock must happen after confirmation, not before
- route progress must not auto-pick a signal without a QR scan

## Recommended Service Breakdown

- `auth-service`
- `user-service`
- `subscription-service`
- `payment-service`
- `trash-signal-service`
- `dispatch-service`
- `tracking-service`
- `qr-scan-service`
- `rewards-service`
- `truck-stats-service`

## When Using This Skill

When asked to plan or generate backend work for this app, produce:

1. endpoint list
2. request/response contracts
3. status transition rules
4. validation rules
5. event/realtime recommendations if tracking is needed

If the user asks for implementation, start from these APIs and keep naming consistent with the app’s existing flow.
