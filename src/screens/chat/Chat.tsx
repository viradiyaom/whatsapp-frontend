import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from 'components/Layout';
import { chats } from 'config/call';
import { SocketContext } from 'providers/socket';
import React, { memo, useContext, useEffect, useState } from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { ChatItemType, OnVideoCall, RootStackParamList } from 'utils/types';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import UploadModel from './components/UploadModel';
import useWebRTC from 'hooks/useWebRTC';
import VideCall from './VideCall';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'> & {
  subHeaderText: string;
};

type MessageType = IMessage & { message: string };

const initialUser = { _id: '', name: '' };

const Chat = ({ route, navigation }: Props) => {
  const user = route.params;
  // const { remoteRTCMessage, peerConnection } = useWebRTC();
  const [roomId, setRoomId] = useState('');
  const socket = useContext(SocketContext);
  const [uploadModel, setUploadModel] = useState(false);
  const [subHeaderText, setSubHeaderText] = useState('');
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [messages, setMessages] = useState<MessageType[]>([]);
  // const [videCallModel, setVideCallModel] = useState<OnVideoCall>(undefined);

  useEffect(() => {
    const unsubscribe = () => {
      if (roomId) {
        socket.emit('unsubscribe', roomId);
      }
    };
    return unsubscribe;
  }, [roomId, socket]);

  useEffect(() => {
    initiateChatRoom();

    socket.on('newMessage', (data: ChatItemType) => {
      const newMsg = {
        ...data,
        text: '',
        user: { _id: data.postedByUser },
        createdAt: +new Date(data.createdAt),
        postedByUser: { _id: data.postedByUser },
      };
      setMessages(e => [newMsg, ...e]);
    });
    socket.on('typingStatus', setSubHeaderText);

    // socket.on('newCall', (data: any) => {
    //   setVideCallModel(data);
    //   remoteRTCMessage.current = data.rtcMessage;
    //   // otherUserId.current = data.callerId;
    //   // setType('INCOMING_CALL');
    // });

    return () => {
      socket.off('newMessage');
      socket.off('typingStatus');
    };
  }, [socket]);

  const sendTextMessage = (v: MessageType[]) => {
    if (roomId) {
      onInputChange('');
      const param = new FormData();
      param.append('content', v[0].message);
      param.append('type', 'TEXT');
      chats.sendMessage(roomId, param);
    }
  };

  const sendOtherMessage = (payload: any) => {
    const type = payload.type.split('/')[0].toUpperCase() || 'IMAGE';
    setUploadModel(false);
    const param = new FormData();
    param.append('content', payload);
    param.append('type', type);
    chats.sendMessage(roomId, param, type);
  };

  const initiateChatRoom = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      const data = JSON.parse(userDetails || '{}').data || '';
      if (data.id) {
        setCurrentUser({ _id: data.id, name: data.name });
        const { data: responseData } = await chats.initiate({
          userIds: [data.id, user.id],
        });
        const response = responseData.data;
        socket.emit('subscribe', response.chatRoomId, [data.id, user.id]);
        setRoomId(response.chatRoomId);
        if (!response.isNew) {
          const { data: chatListData } = await chats.chatListByRoomId(
            response.chatRoomId,
          );
          setMessages(chatListData.data);
        }
      }
    } catch (error) {
      console.log('Error initiating chat:', error);
    }
  };

  const onInputChange = (e: string) => {
    socket.emit(e ? 'typingStart' : 'typingEnd', roomId);
  };

  const handleModelAction = (v: string) => {
    if (v === 'upload') {
      setUploadModel(true);
    }
  };

  const onHeaderAction = async (action: string) => {
    if (action === 'VIDEO_CALL') {
      // const sessionDescription = await peerConnection.current.createOffer();
      // await peerConnection.current.setLocalDescription(sessionDescription);
      // socket.emit('call', {
      //   type: 'VIDEO_CALL',
      //   chatRoomId: roomId,
      //   callerId: currentUser._id,
      //   rtcMessage: sessionDescription,
      // });
    }
  };

  return (
    <Layout className="flex flex-col">
      <StatusBar />
      <ChatHeader
        {...{ route, navigation, subHeaderText, action: onHeaderAction }}
      />
      <ImageBackground
        className="relative flex-1 pb-4"
        source={require('../../assets/images/whatsapp-dark-whatsapp.jpeg')}>
        <GiftedChat
          messages={messages}
          onSend={sendTextMessage}
          renderAvatar={null}
          messagesContainerStyle={{ paddingBottom: 10 }}
          renderMessage={ChatMessage}
          user={currentUser}
          renderInputToolbar={props => (
            <ChatInput
              {...props}
              onValueChange={onInputChange}
              action={handleModelAction}
            />
          )}
        />
        <UploadModel
          open={uploadModel}
          setOpen={setUploadModel}
          sendMessage={sendOtherMessage}
        />
        {/* {videCallModel && (
          <VideCall open={videCallModel} setOpen={setVideCallModel} />
        )} */}
      </ImageBackground>
    </Layout>
  );
};

export default memo(Chat);
