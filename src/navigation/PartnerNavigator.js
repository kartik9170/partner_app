import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../partner_app/screens/DashboardScreen';
import BookOverviewScreen from '../partner_app/screens/BookOverviewScreen';
import BookingRequestDetailScreen from '../partner_app/screens/BookingRequestDetailScreen';
import AcceptedBookingDetailScreen from '../partner_app/screens/AcceptedBookingDetailScreen';
import ServiceVerificationScreen from '../partner_app/screens/ServiceVerificationScreen';
import ServiceCompletionScreen from '../partner_app/screens/ServiceCompletionScreen';
import EarningsScreen from '../partner_app/screens/EarningsScreen';
import PerformanceScreen from '../partner_app/screens/PerformanceScreen';
import WithdrawalScreen from '../partner_app/screens/WithdrawalScreen';
import WithdrawalSuccessScreen from '../partner_app/screens/WithdrawalSuccessScreen';
import ProfileScreen from '../partner_app/screens/ProfileScreen';
import ProfessionalProfileScreen from '../partner_app/screens/ProfessionalProfileScreen';
import { P } from '../theme/partnerTokens';

const Tab = createBottomTabNavigator();
const BookStack = createNativeStackNavigator();
const EarningsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function BookNavigator() {
  return (
    <BookStack.Navigator>
      <BookStack.Screen name="BookingsOverview" component={BookOverviewScreen} options={{ title: 'Book', headerShown: false }} />
      <BookStack.Screen name="BookingRequestDetail" component={BookingRequestDetailScreen} options={{ title: 'Request Details', headerShown: false }} />
      <BookStack.Screen name="AcceptedBookingDetail" component={AcceptedBookingDetailScreen} options={{ title: 'Accepted Booking', headerShown: false }} />
      <BookStack.Screen name="ServiceVerification" component={ServiceVerificationScreen} options={{ title: 'Service Verification', headerShown: false }} />
      <BookStack.Screen name="ServiceCompletion" component={ServiceCompletionScreen} options={{ title: 'Service Complete', headerShown: false }} />
    </BookStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Profile', headerShown: false }} />
      <ProfileStack.Screen name="ProfessionalProfile" component={ProfessionalProfileScreen} options={{ title: 'Professional Profile', headerShown: false }} />
    </ProfileStack.Navigator>
  );
}

function EarningsNavigator() {
  return (
    <EarningsStack.Navigator>
      <EarningsStack.Screen name="EarningsHome" component={EarningsScreen} options={{ title: 'Earnings', headerShown: false }} />
      <EarningsStack.Screen name="Withdraw" component={WithdrawalScreen} options={{ title: 'Withdraw', headerShown: false }} />
      <EarningsStack.Screen name="WithdrawSuccess" component={WithdrawalSuccessScreen} options={{ title: 'Withdraw Success', headerShown: false }} />
      <EarningsStack.Screen name="Performance" component={PerformanceScreen} options={{ title: 'Performance', headerShown: false }} />
    </EarningsStack.Navigator>
  );
}

export default function PartnerNavigator() {
  const iconByRoute = {
    Dashboard: 'home',
    Book: 'event-note',
    Earnings: 'account-balance-wallet',
    Profile: 'account-circle',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: P.secondary,
        tabBarInactiveTintColor: P.outline,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderTopColor: P.surfaceContainerHigh,
        },
        tabBarIcon: ({ color, focused, size }) => (
          <MaterialIcons
            name={iconByRoute[route.name] || 'circle'}
            size={focused ? size + 1 : size}
            color={color}
            style={focused ? { transform: [{ translateY: -1 }] } : undefined}
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="Book" component={BookNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Earnings" component={EarningsNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
