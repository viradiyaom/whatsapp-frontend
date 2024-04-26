import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from 'components/Header';
import Layout from 'components/Layout';
import { SocketContext } from 'providers/socket';
import React, { memo, useContext, useEffect } from 'react';
import {
  AppState,
  AppStateStatus,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from 'utils/types';
import Calls from './tabs/Calls';
import Chats from './tabs/Chats';
import Updates from './tabs/Updates';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

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

  useEffect(() => {
    emitSocketEvent('identity');
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        emitSocketEvent('disconnect');
      }
    };

    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  return (
    <Layout>
      <StatusBar backgroundColor="#1f2c34" />
      <Header className="justify-between px-5">
        <Text className="font-bold text-[18px] text-white">WhatsApp</Text>
        <View className="flex flex-row gap-x-4">
          <Feather name="camera" size={22} color="#fff" />
          <Ionicons name="search-sharp" size={22} color="#fff" />
          <Menu>
            <MenuTrigger>
              <Feather name="more-vertical" size={22} color="#fff" />
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsWrapper: {
                  backgroundColor: '#1f2c34',
                  paddingVertical: 8,
                },
                optionsContainer: {
                  marginTop: 22,
                  borderRadius: 10,
                  maxWidth: '85%',
                },
              }}>
              <MenuOption
                customStyles={{
                  optionText: {
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    color: 'white',
                  },
                }}
                onSelect={() => navigation.navigate('UserList')}
                text="Switch User"
              />
              <MenuOption
                customStyles={{
                  optionText: {
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    color: 'white',
                  },
                }}
                onSelect={async () => {
                  await AsyncStorage.setItem('token', '');
                  await AsyncStorage.setItem('userDetails', '');
                  navigation.replace('Login');
                }}
                text="Log Out"
              />
            </MenuOptions>
          </Menu>
        </View>
      </Header>
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
        className="absolute bottom-0 p-3.5 flex justify-center items-center right-[20px] bg-[#01a984] rounded-2xl"
        style={{ marginBottom: inset.bottom + 15 }}
        onPress={() => navigation.navigate('NewChat')}>
        <MaterialIcons name="chat" size={26} color="#121b22" />
      </TouchableOpacity>
    </Layout>
  );
};

export default memo(Listing);
