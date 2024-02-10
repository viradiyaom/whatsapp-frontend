import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from './src/screens/auth/login';
import SplashScreen from './src/screens/auth/splash';
import { RootStackParamList } from 'utils/types';
import Toast from 'react-native-toast-message';
import Listing from 'screens/main';
import { Text, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Chat from 'screens/chat/Chat';
import SocketProvider from 'providers/socket';
import NewChat from 'screens/chat/NewChat';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Container = () => (
  <NavigationContainer>
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
          headerTitle: '',
          headerStyle: { backgroundColor: '#1f2c34' },
          headerLeft: () => (
            <Text className="font-bold text-[18px] text-white">WhatsApp</Text>
          ),
          headerRight: () => (
            <View className="flex flex-row gap-x-4">
              <Feather name="camera" size={22} color="#fff" />
              <Ionicons name="search-sharp" size={22} color="#fff" />
              <Feather name="more-vertical" size={22} color="#fff" />
            </View>
          ),
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
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
    <Toast position="bottom" visibilityTime={2000} />
  </NavigationContainer>
);
const App = () => (
  <SocketProvider>
    <Container />
  </SocketProvider>
);

export default App;
