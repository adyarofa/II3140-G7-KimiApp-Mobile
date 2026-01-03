import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import SplashScreen from './screens/SplashScreen';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import TeoriScreen from './screens/TeoriScreen';
import AsamBasaScreen from './screens/AsamBasaScreen';
import TitrasiScreen from './screens/TitrasiScreen';
import ReaksiRedoksScreen from './screens/ReaksiRedoksScreen';
import IkatanKimiaScreen from './screens/IkatanKimiaScreen';
import TermokimiaScreen from './screens/TermokimiaScreen';
import StoikiometriScreen from './screens/StoikiometriScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  let [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Teori" component={TeoriScreen} />
          <Stack.Screen name="AsamBasa" component={AsamBasaScreen} />
          <Stack.Screen name="Titrasi" component={TitrasiScreen} />
          <Stack.Screen name="ReaksiRedoks" component={ReaksiRedoksScreen} />
          <Stack.Screen name="IkatanKimia" component={IkatanKimiaScreen} />
          <Stack.Screen name="Termokimia" component={TermokimiaScreen} />
          <Stack.Screen name="Stoikiometri" component={StoikiometriScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </>
  );
}