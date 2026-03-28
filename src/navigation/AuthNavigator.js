import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PARTNER } from '../components/BookiAuthChrome';
import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import PartnerPasswordLoginScreen from '../screens/Auth/PartnerPasswordLoginScreen';
import PartnerOtpVerifyScreen from '../screens/Auth/PartnerOtpVerifyScreen';
import PartnerProfileSetupScreen from '../partner_app/screens/PartnerProfileSetupScreen';
import PartnerRegistrationStep2Screen from '../partner_app/screens/PartnerRegistrationStep2Screen';
import PartnerRegistrationStep3Screen from '../partner_app/screens/PartnerRegistrationStep3Screen';
import PartnerVerificationScreen from '../partner_app/screens/PartnerVerificationScreen';
import PartnerSupportDetailsScreen from '../partner_app/screens/PartnerSupportDetailsScreen';
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
import ProfessionalProfileScreen from '../partner_app/screens/ProfessionalProfileScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: PARTNER.bg },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PartnerPasswordLogin" component={PartnerPasswordLoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PartnerOtpVerify" component={PartnerOtpVerifyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PartnerProfileSetup" component={PartnerProfileSetupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PartnerRegisterStep2" component={PartnerRegistrationStep2Screen} options={{ headerShown: false }} />
      <Stack.Screen name="PartnerRegisterStep3" component={PartnerRegistrationStep3Screen} options={{ headerShown: false }} />
      <Stack.Screen name="PartnerVerification" component={PartnerVerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PartnerSupportDetails" component={PartnerSupportDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PartnerHomePreview" component={DashboardScreen} options={{ title: 'Partner Home', headerShown: false }} />
      <Stack.Screen name="PartnerEarningsPreview" component={EarningsScreen} options={{ title: 'Partner Earnings', headerShown: false }} />
      <Stack.Screen name="PartnerWithdrawPreview" component={WithdrawalScreen} options={{ title: 'Partner Withdraw', headerShown: false }} />
      <Stack.Screen name="PartnerWithdrawSuccessPreview" component={WithdrawalSuccessScreen} options={{ title: 'Withdraw Success', headerShown: false }} />
      <Stack.Screen name="PartnerPerformancePreview" component={PerformanceScreen} options={{ title: 'Partner Performance', headerShown: false }} />
      <Stack.Screen name="PartnerProfessionalProfilePreview" component={ProfessionalProfileScreen} options={{ title: 'Partner Profile', headerShown: false }} />
      <Stack.Screen
        name="PartnerBookPreview"
        component={BookOverviewScreen}
        initialParams={{ detailRouteName: 'PartnerBookDetailPreview', acceptedDetailRouteName: 'PartnerAcceptedBookDetailPreview' }}
        options={{ title: 'Partner Book', headerShown: false }}
      />
      <Stack.Screen name="PartnerBookDetailPreview" component={BookingRequestDetailScreen} options={{ title: 'Request Detail', headerShown: false }} />
      <Stack.Screen name="PartnerAcceptedBookDetailPreview" component={AcceptedBookingDetailScreen} options={{ title: 'Accepted Detail', headerShown: false }} />
      <Stack.Screen name="PartnerServiceVerificationPreview" component={ServiceVerificationScreen} options={{ title: 'Verify Service', headerShown: false }} />
      <Stack.Screen name="PartnerServiceCompletionPreview" component={ServiceCompletionScreen} options={{ title: 'Service Completion', headerShown: false }} />
    </Stack.Navigator>
  );
}
