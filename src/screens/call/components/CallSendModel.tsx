import React, { useEffect, useRef, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MediaStream, RTCView, mediaDevices } from 'react-native-webrtc';
import { VideoCallParams } from 'utils/types';
import Footer from './Footer';

type Props = {
  stream: MediaStream | null;
  open: boolean;
  config: VideoCallParams;
  onAction: (v: string) => void;
  setOpen: (v: React.SetStateAction<boolean>) => void;
};

const CallSendModel = ({ stream, config, open, setOpen, onAction }: Props) => {
  // const [stream, setStream] = useState<MediaStream | null>(null);
  console.log('🚀 - CallSendModel - stream:', stream);
  const rtcViewRef = useRef(null);
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    const openCamera = async () => {
      try {
        // const constraints = { video: true, audio: false };
        // const newStream = await mediaDevices.getUserMedia(constraints);
        // console.log('🚀 - openCamera - newStream:', newStream);
        // setStream(newStream);
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
    setOpen(false);
    stream?.getTracks().forEach(track => {
      track.stop();
    });
  };

  return (
    <Modal animationType="fade" visible={open} onRequestClose={toggleModal}>
      <View className="flex bg-gray-200 h-screen relative justify-center items-center">
        {stream ? (
          <RTCView
            streamURL={stream.toURL()}
            style={
              {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: 'red',
              } as any
            }
            ref={rtcViewRef}
          />
        ) : (
          <Text className="text-white">Opening camera...</Text>
        )}
        {config && (
          <View
            className="h-full absolute flex-col justify-between  top-0 z-10"
            style={{
              paddingTop: top + 50,
            }}>
            <View>
              <Text className="text-white text-[31px] text-center mt-2">
                {config.name}
              </Text>
              <Text className="text-white text-center mt-1 text-[16px]">
                Ringing
              </Text>
            </View>

            <Footer onAction={onAction} />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CallSendModel;
