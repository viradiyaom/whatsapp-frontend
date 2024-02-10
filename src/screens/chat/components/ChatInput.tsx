import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChatInput = ({ containerStyle, onValueChange, ...props }: any) => {
  const [message, setMessage] = useState('');
  return (
    <View className="flex flex-row w-full gap-1.5 px-3">
      <View className="flex-1 bg-[#1f2c34] rounded-full flex flex-row px-1.5 gap-x-1 items-center">
        <FontAwesome5 name="smile" size={25} color="#85939e" />

        <View className="flex-1 bg-white">
          <TextInput
            {...props}
            value={message}
            className="w-full h-10 px-1"
            placeholderTextColor="#74808a"
            onChangeText={v => {
              setMessage(v);
              onValueChange(v);
            }}
            style={{ backgroundColor: '#1f2c34', color: '#fff' }}
            placeholder="Message"
          />
        </View>
        <View className="flex flex-row items-center gap-2 mr-2">
          <Ionicons name="attach-sharp" size={25} color="#85939e" />
          {!message && (
            <View className="bg-[#85939e] rounded-full p-0.5 mr-1.5">
              <MaterialCommunityIcons
                name="currency-inr"
                size={17}
                color="#1f2c34"
              />
            </View>
          )}
          {!message && <FontAwesome name="camera" size={20} color="#85939e" />}
        </View>
      </View>
      <TouchableOpacity
        className="bg-[#00aa84] p-2.5 rounded-full "
        onPress={() => {
          props.onSend({ type: 'TEXT', message });
          setMessage('');
        }}>
        {message ? (
          <Ionicons name="send-sharp" size={22} color="#fff" />
        ) : (
          <MaterialIcons name="mic" size={22} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
