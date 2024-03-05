import { format } from 'date-fns';
import React, { memo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { ENV } from 'utils';
import { CurrentMessageType } from '../ChatMessage';

type ImageType = CurrentMessageType & { isCurrentUser: boolean };
const ImageChat = ({
  message,
  createdAt,
  isCurrentUser,
  postedByUser,
}: ImageType) => {
  const { top } = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(e => !e);
  };
  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <Image
          source={{ uri: ENV.IMAGE_URL + '/chats/images/' + message }}
          className="h-[280px] w-[200px] rounded-[7.5px] z-10"
        />
      </TouchableOpacity>
      <Text className="text-white text-[11px] absolute bottom-[5px] right-[10px] z-20">
        {format(createdAt, ' hh:mm aa')}
      </Text>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View className="flex bg-black h-screen justify-center items-center">
          <View
            className="absolute top-0 w-full flex-row gap-x-3 items-center bg-[#1f2c33] px-2 py-2"
            style={{ paddingTop: Platform.OS === 'ios' ? top + 10 : 10 }}>
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View className="gap-y-1 flex-1">
              <Text className="text-white capitalize text-[16px] font-semibold">
                {isCurrentUser ? 'You' : postedByUser.name}
              </Text>
              <Text className="text-white">
                {format(createdAt, 'd MMM, hh:mm aa')}
              </Text>
            </View>
            <View className="flex-row gap-x-4 pr-1">
              <Feather name="star" size={22} color="#fff" />
              <Fontisto name="share-a" size={20} color="#fff" />
              <SimpleLineIcons name="options-vertical" size={20} color="#fff" />
            </View>
          </View>
          <Image
            className="h-[70%] w-full object-contain"
            source={{ uri: ENV.IMAGE_URL + '/chats/images/' + message }}
          />
        </View>
      </Modal>
    </>
  );
};

export default memo(ImageChat);
