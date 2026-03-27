import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import PartnerNavigator from './PartnerNavigator';
import useAuth from '../hooks/useAuth';

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const content = isAuthenticated ? <PartnerNavigator /> : <AuthNavigator />;

  return <NavigationContainer>{content}</NavigationContainer>;
}
