import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from 'components/Layout';
import { chats } from 'config/call';
import { format } from 'date-fns';
import React, { memo, useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ENV } from 'utils';
import { RecentChatItem, RootStackParamList } from 'utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chats'>;
type CHatItemType = RecentChatItem & { navigation: any };

const ChatItem = ({
  navigation,
  message,
  type,
  createdAt,
  user: { name, id },
}: CHatItemType) => (
  <TouchableOpacity
    className="flex flex-row items-center p-2.5 border-b border-gray-200/5 gap-x-2.5"
    onPress={() => navigation.navigate('Chat', { id, name })}>
    <Image
      className="w-12 h-12 rounded-full"
      source={{
        uri: ENV.IMAGE_URL + '/images/profilePhoto/' + id + '.png',
      }}
    />
    <View className="flex-1">
      <Text className="font-bold text-white capitalize">{name}</Text>
      {type === 'TEXT' ? (
        <Text className="text-[#87959f] mt-0.5">{message}</Text>
      ) : (
        <View className="flex-row gap-x-1 mt-0.5 -mb-1">
          {type === 'IMAGE' ? (
            <MaterialIcons name="photo" size={15} color="#87959f" />
          ) : (
            <Ionicons name="videocam" size={15} color="#87959f" />
          )}
          <Text className="text-[#87959f]">
            {type === 'IMAGE' ? 'Photo' : 'Video'}
          </Text>
        </View>
      )}
    </View>
    <View>
      <Text className="text-[#6e7c85] text-[11px]">
        {format(new Date(createdAt), 'HH:mm aa')}
      </Text>
    </View>
  </TouchableOpacity>
);

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
        renderItem={({ item }) => (
          <ChatItem navigation={navigation} {...item} />
        )}
      />
    </Layout>
  );
};

export default memo(Chats);
