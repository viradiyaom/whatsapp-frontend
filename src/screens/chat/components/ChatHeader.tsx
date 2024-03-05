import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from 'components/Header';
import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ENV } from 'utils';
import { RootStackParamList } from 'utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'> & {
  subHeaderText: string;
};

const ChatHeader = ({
  route: {
    params: { name, id },
  },
  navigation,
  subHeaderText,
}: Props) => (
  <Header>
    <TouchableOpacity onPress={() => navigation.pop()}>
      <Ionicons name="chevron-back" size={22} color="#fff" />
    </TouchableOpacity>
    <Image
      className="ml-1 mr-3 rounded-full w-11 h-11"
      source={{ uri: ENV.IMAGE_URL + '/images/profilePhoto/' + id + '.png' }}
    />
    <View>
      <Text className="font-bold text-white text-[18px]">{name}</Text>
      <Text className="text-white text-[12px]">{subHeaderText}</Text>
    </View>
    <View className="flex-1" />
    <View className="flex flex-row gap-x-5">
      <FontAwesome name="video-camera" size={22} color="#fff" />
      <FontAwesome name="phone" size={22} color="#fff" />
      <Feather name="more-vertical" size={22} color="#fff" />
    </View>
  </Header>
);

export default memo(ChatHeader);
