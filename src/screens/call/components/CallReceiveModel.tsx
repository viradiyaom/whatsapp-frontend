import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MediaStream, RTCView, mediaDevices } from 'react-native-webrtc';
import { ENV } from 'utils';
import { VideoCallParams } from 'utils/types';

type Props = {
  onAnswer: (v: VideoCallParams) => void;
  open: VideoCallParams;
  setOpen: (v: React.SetStateAction<VideoCallParams>) => void;
};

const CallReceiveModel = ({ open, setOpen, onAnswer }: Props) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const rtcViewRef = useRef(null);
  const { top, bottom } = useSafeAreaInsets();

  useEffect(() => {
    const openCamera = async () => {
      try {
        const constraints = { video: true, audio: false };
        const newStream = await mediaDevices.getUserMedia(constraints);
        setStream(newStream);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    openCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  const toggleModal = () => {
    setOpen(undefined);
    stream?.getTracks().forEach(track => {
      track.stop();
    });
  };

  return (
    <Modal animationType="fade" visible={!!open} onRequestClose={toggleModal}>
      <View className="flex bg-gray-200 h-screen relative justify-center items-center">
        {stream ? (
          <RTCView
            streamURL={stream.toURL()}
            style={{ width: '100%', height: '100%', objectFit: 'cover' } as any}
            ref={rtcViewRef}
          />
        ) : (
          <Text className="text-white">Opening camera...</Text>
        )}
        {open && (
          <View
            className="h-full absolute flex-col justify-between  top-0 z-10"
            style={{
              paddingTop: top + 50,
              paddingBottom: bottom + (Platform.OS === 'android' ? 20 : 0),
            }}>
            <View>
              <Image
                className="mx-auto rounded-full w-28 h-28"
                source={{
                  uri:
                    ENV.IMAGE_URL + '/images/profilePhoto/' + open.id + '.png',
                }}
              />
              <Text className="text-white text-[31px] text-center mt-2">
                {open.name}
              </Text>
              <Text className="text-white text-center mt-1 text-[18px]">
                WhatsApp video call
              </Text>
            </View>
            <View className="flex-row justify-around w-full">
              <View className="items-center">
                <TouchableOpacity className="bg-black/80 p-5 rounded-full">
                  <View className="-rotate-[135deg]">
                    <FontAwesome5 name="phone" size={23} color="#ff4035" />
                  </View>
                </TouchableOpacity>
                <Text className="mt-2 text-gray-400 text-[14px]">Decline</Text>
              </View>
              <View className="items-center">
                <TouchableOpacity
                  className="bg-[#47b9f5] p-5 rounded-full"
                  onPress={() => onAnswer(open)}>
                  <FontAwesome name="video-camera" size={26} color="#fff" />
                </TouchableOpacity>
                <Text className="mt-2 text-gray-400 text-[14px]">
                  Swipe up to accept
                </Text>
              </View>
              <View className="items-center">
                <TouchableOpacity className="bg-black/80 p-5 rounded-full">
                  <MaterialCommunityIcons
                    name="android-messages"
                    size={25}
                    color="#fff"
                  />
                </TouchableOpacity>
                <Text className="mt-2 text-gray-400 text-[14px]">Message</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CallReceiveModel;
