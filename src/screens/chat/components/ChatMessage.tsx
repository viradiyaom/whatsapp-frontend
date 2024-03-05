import React from 'react';
import { IMessage, MessageProps } from 'react-native-gifted-chat';
import Container from './message/Container';
import ImageChat from './message/Image';
import TextChat from './message/Text';
import VideoChat from './message/Video';

export type CurrentMessageType = {
  postedByUser: { _id: string; name: string };
  message: string;
  type: string;
  createdAt: string;
};

const customClass = {
  TEXT: 'rounded-[12px] py-1.5 pl-2.5',
  IMAGE: 'rounded-[7.5px] p-1',
  VIDEO: 'rounded-[7.5px] p-1',
};

const ChatMessage = ({
  currentMessage,
  user,
  previousMessage,
}: Readonly<MessageProps<IMessage>> & {
  currentMessage: CurrentMessageType;
}) => {
  const type = currentMessage.type as keyof typeof customClass;
  const isCurrentUser = currentMessage?.postedByUser._id === user?._id;
  const isSamePrevious =
    currentMessage?.postedByUser._id === previousMessage?.user?._id;

  return (
    <Container
      className={`${customClass[type]}`}
      isCurrentUser={isCurrentUser}
      isSamePrevious={isSamePrevious}>
      {type === 'TEXT' && <TextChat {...currentMessage} />}
      {type === 'IMAGE' && (
        <ImageChat isCurrentUser={isCurrentUser} {...currentMessage} />
      )}
      {type === 'VIDEO' && <VideoChat {...currentMessage} />}
    </Container>
  );
};

export default ChatMessage;
