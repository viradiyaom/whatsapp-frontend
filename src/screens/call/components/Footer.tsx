import React from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  videoEnabled?: boolean;
  audioEnabled?: boolean;
  onAction: (v: string) => void;
};

const Footer = ({ videoEnabled, audioEnabled, onAction }: Props) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className={`bg-dark-toolbar flex-row items-center justify-around  pt-5 mx-0.5 rounded-t-lg w-screen`}
      style={{
        paddingBottom: bottom + (Platform.OS === 'android' ? 20 : 0),
      }}>
      <TouchableOpacity onPress={() => onAction('TOGGLE_CAMERA')}>
        <Ionicons
          name="camera-reverse"
          size={27}
          color="#fff"
          className="rotate"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <MaterialIcons
          name="mobile-screen-share"
          size={27}
          color="#fff"
          className="rotate"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onAction('TOGGLE_CAMERA_MODE')}>
        {videoEnabled ? (
          <FontAwesome6
            name="video-slash"
            size={23}
            color="#fff"
            className="rotate"
          />
        ) : (
          <FontAwesome6
            name="video"
            size={23}
            color="#fff"
            className="rotate"
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onAction('TOGGLE_MIC_MODE')}>
        {audioEnabled ? (
          <MaterialCommunityIcons
            name="microphone"
            size={27}
            color="#fff"
            className="rotate"
          />
        ) : (
          <MaterialCommunityIcons
            name="microphone-off"
            size={25}
            color="#fff"
            className="rotate"
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-[#ff4035] p-3 rounded-full"
        onPress={() => onAction('END_CALL')}>
        <View className="-rotate-[135deg]">
          <FontAwesome5 name="phone" size={23} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
