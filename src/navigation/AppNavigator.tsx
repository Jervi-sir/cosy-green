import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { RecyclingScreen } from '../screens/RecyclingScreen';
import { RequestDetailsScreen } from '../screens/RequestDetailsScreen';
import { RequestsScreen } from '../screens/RequestsScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { colors, radius } from '../theme';
import { Text, View } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Welcome: undefined;
  MainTabs: undefined;
  RequestDetails: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Requests: undefined;
  Recycling: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.surface,
    card: colors.white,
    primary: colors.primary,
    text: colors.ink,
    border: 'transparent',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 18,
          right: 18,
          bottom: 18,
          height: 76,
          backgroundColor: colors.white,
          borderTopWidth: 0,
          borderRadius: radius.xl,
          paddingHorizontal: 14,
          paddingTop: 12,
          ...{
            shadowColor: '#0E3B2F',
            shadowOpacity: 0.12,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
          },
        },
        tabBarIcon: ({ focused }) => {
          const iconMap: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Requests: 'file-tray-full',
            Recycling: 'leaf',
            Profile: 'person',
          };

          return (
            <Ionicons
              name={iconMap[route.name as keyof MainTabParamList]}
              size={24}
              color={focused ? colors.primary : colors.muted}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Recycling" component={RecyclingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="RequestDetails"
          component={RequestDetailsScreen}
          options={{ presentation: 'card', }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
