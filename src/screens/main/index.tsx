import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from 'components/Layout';
import { SocketContext } from 'providers/socket';
import React, { useContext, useEffect } from 'react';
import { AppState, AppStateStatus, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from 'utils/types';
import Calls from './tabs/Calls';
import Chats from './tabs/Chats';
import Updates from './tabs/Updates';

type Props = NativeStackScreenProps<RootStackParamList, 'Listing'>;

const Tab = createMaterialTopTabNavigator();

const Listing = ({ navigation }: Props) => {
  const inset = useSafeAreaInsets();
  const socket = useContext(SocketContext);

  const emitSocketEvent = async (eventName: string) => {
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      const userID = JSON.parse(userDetails || '{}').data.id || '';
      if (userID) {
        socket.emit(eventName, userID);
      }
    } catch (error) {
      console.error('Error while emitting socket event:', error);
    }
  };

  const initiateUser = () => emitSocketEvent('identity');
  const deActivateUser = () => emitSocketEvent('disconnect');

  useEffect(() => {
    initiateUser();
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        deActivateUser();
      }
    };

    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  return (
    <Layout>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontWeight: '600',
            textTransform: 'capitalize',
          },
          tabBarInactiveTintColor: '#8795a1',
          tabBarActiveTintColor: '#05a884',
          tabBarStyle: { backgroundColor: '#1f2c34' },
          tabBarIndicatorStyle: { backgroundColor: '#05a884' },
        }}>
        {/* @ts-ignore */}
        <Tab.Screen name="Chats" component={Chats} />
        <Tab.Screen name="Updates" component={Updates} />
        <Tab.Screen name="Calls" component={Calls} />
      </Tab.Navigator>
      <TouchableOpacity
        className="absolute bottom-0 p-4 right-[20px] bg-[#01a984] rounded-2xl"
        style={{ marginBottom: inset.bottom + 5 }}
        onPress={() => navigation.navigate('NewChat')}>
        <MaterialIcons name="chat" size={26} color="#121b22" />
      </TouchableOpacity>
    </Layout>
  );
};

export default Listing;
