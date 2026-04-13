import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors, radius } from "../theme";
import { SignalTrashScreen } from "@/screens/client/signal-trash-screen";
import { TruckLocationScreen } from "@/screens/client/truck-location-screen";
import { PointsScreen } from "@/screens/client/points-screen";
import { DriverNewTrashScreen } from "@/screens/truck/driver-new-trash-screen";
import { DriverConfirmedScreen } from "@/screens/truck/driver-confirmed-screen";
import { TruckProfileScreen } from "@/screens/truck/truck-profile-screen";
import { LoadingScreen } from "@/screens/auth/loading-screen";
import { LoginScreen } from "@/screens/auth/login-screen";
import { SubscriptionScreen } from "@/screens/common/subscription-screen";
import { AccountTypeScreen } from "@/screens/auth/account-type-screen";
import { PaymentScreen } from "@/screens/common/payment-screen";
import { CreateTrashScreen } from "@/screens/client/create-trash-screen";
import { UserTrashDetailsScreen } from "@/screens/common/user-trash-details-screen";
import { DriverTrashDetailsScreen } from "@/screens/common/driver-trash-details-screen";
import { ConceptProvider } from "@/screens/interaction/context";
import { TruckQrScannerScreen } from "@/screens/truck/truck-qr-scanner-screen";

export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  Subscription: undefined;
  AccountType: undefined;
  Payment: undefined;
  UserApp: undefined;
  TruckApp: undefined;
  RequestDetails: undefined;
  UserTrashDetails: { signalId: string };
  TruckTrashDetails: { signalId: string };
  TruckQrScanner: { signalId: string };
  Welcome: undefined;
  Register: undefined;
  ModeSelect: undefined;
  UserFlow: undefined;
  TruckFlow: undefined;
  MainTabs: undefined;
};

export type UserTabParamList = {
  Signal: undefined;
  Truck: undefined;
  Points: undefined;
};

export type TruckTabParamList = {
  NewTrash: undefined;
  ConfirmedTrash: undefined;
  Route: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const UserTab = createBottomTabNavigator<UserTabParamList>();
const TruckTab = createBottomTabNavigator<TruckTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.surface,
    card: colors.white,
    primary: colors.primary,
    text: colors.ink,
    border: "transparent",
  },
};

function sharedTabScreenOptions(
  iconMap: Record<string, keyof typeof Ionicons.glyphMap>,
) {
  return ({ route }: { route: { name: string } }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.primaryDeep,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: {
      height: 72,
      paddingTop: 10,
      paddingBottom: 10,
      borderTopWidth: 0,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      position: "absolute" as const,
      left: 14,
      right: 14,
      bottom: 14,
      backgroundColor: colors.white,
      shadowColor: "#0C4E2D",
      shadowOpacity: 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 12,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "700" as const,
    },
    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
      <Ionicons name={iconMap[route.name]} size={size} color={color} />
    ),
  });
}

function UserTabs() {
  return (
    <UserTab.Navigator
      initialRouteName="Signal"
      screenOptions={sharedTabScreenOptions({
        Signal: "add-circle-outline",
        Truck: "car-outline",
        Points: "star-outline",
      })}
    >
      <UserTab.Screen
        name="Signal"
        component={SignalTrashScreen}
        options={{ title: "البلاغات" }}
      />
      <UserTab.Screen
        name="Truck"
        component={TruckLocationScreen}
        options={{ title: "الشاحنة" }}
      />
      <UserTab.Screen
        name="Points"
        component={PointsScreen}
        options={{ title: "النقاط" }}
      />
    </UserTab.Navigator>
  );
}

function TruckTabs() {
  return (
    <TruckTab.Navigator
      initialRouteName="NewTrash"
      screenOptions={sharedTabScreenOptions({
        NewTrash: "alert-circle-outline",
        ConfirmedTrash: "checkmark-done-outline",
        Route: "map-outline",
        Profile: "person-outline",
      })}
    >
      <TruckTab.Screen
        name="NewTrash"
        component={DriverNewTrashScreen}
        options={{ title: "جديد" }}
      />
      <TruckTab.Screen
        name="ConfirmedTrash"
        component={DriverConfirmedScreen}
        options={{ title: "مؤكد" }}
      />
      <TruckTab.Screen
        name="Route"
        component={TruckLocationScreen}
        options={{ title: "المسار" }}
      />
      <TruckTab.Screen
        name="Profile"
        component={TruckProfileScreen}
        options={{ title: "الملف" }}
      />
    </TruckTab.Navigator>
  );
}

function LegacyScreen() {
  return (
    <LoadingScreen navigation={undefined as never} route={undefined as never} />
  );
}

export function AppNavigator() {
  return (
    <ConceptProvider>
      <NavigationContainer
        theme={navTheme}
        onStateChange={(state) => {
          const currentRoute = state?.routes[state.index ?? 0];
          console.log("[navigation]", currentRoute?.name);
        }}
      >
        <Stack.Navigator
          initialRouteName="Loading"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="AccountType" component={AccountTypeScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="UserApp" component={UserTabs} />
          <Stack.Screen name="TruckApp" component={TruckTabs} />
          <Stack.Screen name="RequestDetails" component={CreateTrashScreen} />
          <Stack.Screen
            name="UserTrashDetails"
            component={UserTrashDetailsScreen}
          />
          <Stack.Screen
            name="TruckTrashDetails"
            component={DriverTrashDetailsScreen}
          />
          <Stack.Screen
            name="TruckQrScanner"
            component={TruckQrScannerScreen}
          />
          {/* <Stack.Screen name="Welcome" component={LegacyScreen} /> */}
          {/* <Stack.Screen name="Register" component={LegacyScreen} /> */}
          {/* <Stack.Screen name="ModeSelect" component={LegacyScreen} /> */}
          <Stack.Screen name="UserFlow" component={UserTabs} />
          <Stack.Screen name="MainTabs" component={UserTabs} />
          <Stack.Screen name="TruckFlow" component={TruckTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </ConceptProvider>
  );
}
