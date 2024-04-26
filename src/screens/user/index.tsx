import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from 'components/Header';
import Layout from 'components/Layout';
import { chats } from 'config/call';
import React, { memo, useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ENV } from 'utils';
import { LoginResponse, RootStackParamList } from 'utils/types';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'NewChat'>;

const UserList = ({ navigation }: Props) => {
  const [users, setUsers] = useState<LoginResponse[]>([]);
  const [currentUser, setCurrentUser] = useState<LoginResponse | undefined>(
    undefined,
  );
  const fetchUsers = async () => {
    const list = JSON.parse((await AsyncStorage.getItem('userList')) || '[]');
    setUsers(list);

    setCurrentUser(
      JSON.parse((await AsyncStorage.getItem('userDetails')) || ''),
    );
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <Layout>
      <Header>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="font-medium text-white  text-[16px]">
            Switch User
          </Text>
        </View>
      </Header>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex flex-row items-center py-2.5 px-3 border-b border-gray-200/5 gap-x-2.5"
            onPress={async () => {
              await AsyncStorage.setItem('userDetails', JSON.stringify(item));
              await AsyncStorage.setItem('token', item.token);
              Toast.show({
                type: 'success',
                text1: 'User switched successfully',
              });
              navigation.replace('Listing');
            }}>
            <Image
              className="w-12 h-12 rounded-full"
              source={{
                uri:
                  ENV.IMAGE_URL +
                  '/images/profilePhoto/' +
                  item.data.id +
                  '.png',
              }}
            />
            <Text className="font-bold flex-1 text-white capitalize">
              {item.data.name}
            </Text>
            {currentUser?.data.id !== item.data.id && (
              <MaterialIcons name="login" size={22} color="#fff" />
            )}
          </TouchableOpacity>
        )}
      />
    </Layout>
  );
};

export default UserList;
