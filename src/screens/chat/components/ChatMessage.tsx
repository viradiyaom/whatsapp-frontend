import { format } from 'date-fns';
import React from 'react';
import { Text, View } from 'react-native';
import { IMessage, MessageProps } from 'react-native-gifted-chat';

const ChatMessage = ({
  currentMessage,
  user,
  previousMessage,
}: Readonly<MessageProps<IMessage>> & {
  currentMessage: { postedByUser: string; message: string };
}) => {
  const isCurrentUser = currentMessage?.postedByUser === user?._id;
  const isSamePrevious =
    currentMessage?.postedByUser === previousMessage?.user?._id;

  return (
    <View
      className={` mx-3 px-3 py-2 w-auto relative rounded-xl pr-[63px] ${
        isSamePrevious ? 'mt-0.5' : 'mt-2'
      } ${
        isCurrentUser ? 'bg-[#015c4b] self-end' : 'bg-[#1f2c33] self-start'
      }`}>
      <Text className="text-white text-[15.5px]">
        {currentMessage?.message}
      </Text>
      <Text className="text-[#a5aaad] text-[11px] absolute bottom-[3px] right-[8px]">
        {format(currentMessage?.createdAt, " hh:mm aaaaa'm'")}
      </Text>
      {!isSamePrevious &&
        (isCurrentUser ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: -8,
              borderBottomWidth: 23,
              borderBottomColor: 'transparent',
              borderLeftWidth: 17,
              borderLeftColor: '#015c4b',
            }}
          />
        ) : (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: -8,
              borderBottomWidth: 23,
              borderBottomColor: 'transparent',
              borderRightWidth: 17,
              borderRightColor: '#1f2c33',
            }}
          />
        ))}
    </View>
  );
};

export default ChatMessage;
