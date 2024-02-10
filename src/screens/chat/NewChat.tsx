import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from 'components/Layout';
import { chats } from 'config/call';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ENV } from 'utils';
import { RootStackParamList } from 'utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'> & {
  contacts: number;
};

const Header = ({ contacts, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View className="bg-[#1f2c34]">
      <View
        className="flex flex-row items-center px-2 py-3 "
        style={{ marginTop: insets.top }}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="font-medium text-white  text-[16px]">
            Select Contacts
          </Text>
          <Text className="text-white text-[12px]">{contacts} contacts</Text>
        </View>
        <View className="flex-1" />
        <View className="flex flex-row gap-x-5">
          <Ionicons name="search-sharp" size={22} color="#fff" />
          <Feather name="more-vertical" size={22} color="#fff" />
        </View>
      </View>
    </View>
  );
};

const NewChat = (props: Props) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    chats.fetchAllUsers().then(({ data }) => {
      setContacts(data.data);
    });
  }, []);

  return (
    <Layout>
      <Header {...{ ...props, contacts: contacts.length }} />
      <FlatList
        data={contacts}
        renderItem={({ item: { name, id } }) => (
          <TouchableOpacity
            className="flex flex-row items-center p-2.5 border-b border-gray-200/5 gap-x-2.5"
            onPress={() => props.navigation.navigate('Chat', { id, name })}>
            <Image
              className="w-12 h-12 rounded-full"
              source={{ uri: ENV.IMAGE_URL + '/profilePhoto/' + id + '.png' }}
            />
            <View className="flex-1">
              <Text className="font-bold text-white capitalize">{name}</Text>
              <Text className="text-[#87959f] mt-0.5">
                Hey there! i am using WhatsApp.
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </Layout>
  );
};

export default NewChat;
