import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from 'components/Layout';
import { chats } from 'config/call';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { ENV } from 'utils';
import { RecentChatItem, RootStackParamList } from 'utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chats'>;

const Chats = ({ navigation }: Props) => {
  const [listing, setListing] = useState<RecentChatItem[]>([]);

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const { data } = await chats.recent();
        setListing(data.data);
      } catch (error) {
        console.log('Error fetching recent chats:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchRecentChats);
    return unsubscribe;
  }, []);

  return (
    <Layout>
      <FlatList
        data={listing}
        renderItem={({
          item: {
            message,
            createdAt,
            user: { name, id },
          },
        }) => (
          <TouchableOpacity
            className="flex flex-row items-center p-2.5 border-b border-gray-200/5 gap-x-2.5"
            onPress={() => navigation.navigate('Chat', { id, name })}>
            <Image
              className="w-12 h-12 rounded-full"
              source={{ uri: ENV.IMAGE_URL + '/profilePhoto/' + id + '.png' }}
            />
            <View className="flex-1">
              <Text className="font-bold text-white capitalize">{name}</Text>
              <Text className="text-[#87959f] mt-0.5">{message}</Text>
            </View>
            <View>
              <Text className="text-[#6e7c85] text-[11px]">
                {format(new Date(createdAt), 'HH:mm aa')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </Layout>
  );
};

export default Chats;
