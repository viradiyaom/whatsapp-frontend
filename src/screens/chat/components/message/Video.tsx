import { format } from 'date-fns';
import { memo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Video from 'react-native-video';
import { ENV } from 'utils';
import { CurrentMessageType } from '../ChatMessage';

const VideoChat = ({ message, createdAt }: CurrentMessageType) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  return (
    <TouchableOpacity onPress={() => setIsFullScreen(true)}>
      <Video
        source={{
          uri: ENV.IMAGE_URL + '/chats/videos/' + message,
        }}
        fullscreen={isFullScreen}
        className="h-[280px] w-[200px] rounded-[7.5px] z-10"
        onFullscreenPlayerDidDismiss={() => setIsFullScreen(false)}
        resizeMode="cover"
        paused
      />
      <View className="absolute top-[40%] left-[40%] z-20 bg-black/50 p-2.5 rounded-full">
        <Entypo name="controller-play" size={22} color="#fff" />
      </View>
      <Text className="text-white text-[11px] absolute bottom-[5px] right-[10px] z-20">
        {format(createdAt, ' hh:mm aa')}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(VideoChat);
