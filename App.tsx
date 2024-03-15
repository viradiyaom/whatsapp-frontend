import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SocketProvider from 'providers/socket';
import React from 'react';
import Toast from 'react-native-toast-message';
import Chat from 'screens/chat/Chat';
import NewChat from 'screens/chat/NewChat';
import Listing from 'screens/main';
import { RootStackParamList } from 'utils/types';
import LoginScreen from './src/screens/auth/login';
import SplashScreen from './src/screens/auth/splash';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Container = () => (
  <Stack.Navigator initialRouteName="Splash">
    <Stack.Screen
      name="Splash"
      component={SplashScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Listing"
      component={Listing}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="NewChat"
      component={NewChat}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={{
        headerShown: false,
        headerStyle: { backgroundColor: '#1f2c34' },
      }}
    />
  </Stack.Navigator>
);
const App = () => (
  <SocketProvider>
    <NavigationContainer>
      <Container />
      <Toast position="bottom" visibilityTime={2000} />
    </NavigationContainer>
  </SocketProvider>
);

export default App;
