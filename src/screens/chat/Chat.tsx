import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from 'components/Layout';
import SafeAreaView from 'components/SafeAreaView';
import { chats } from 'config/call';
import { SocketContext } from 'providers/socket';
import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatItemType, RootStackParamList } from 'utils/types';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'> & {
  subHeaderText: string;
};

type MessageType = IMessage & { message: string };

const initialUser = { _id: '', name: '' };

const Chat = ({ route, navigation }: Props) => {
  const user = route.params;
  const [currentUser, setCurrentUser] = useState(initialUser);
  const insets = useSafeAreaInsets();
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [roomId, setRoomId] = useState('');
  const [subHeaderText, setSubHeaderText] = useState('');

  const onSend = (v: MessageType[]) => {
    if (roomId) {
      chats.sendMessage(roomId, { messageText: v[0].message });
    }
  };

  const initiateChat = async () => {
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

  useEffect(() => {
    const unsubscribe = () => {
      if (roomId) {
        socket.emit('unsubscribe', roomId);
      }
    };
    return unsubscribe;
  }, [roomId, socket]);

  useEffect(() => {
    initiateChat();

    const handleNewMessage = (data: ChatItemType) => {
      const newMsg = {
        ...data,
        text: '',
        user: { _id: data.postedByUser },
        createdAt: +new Date(data.createdAt),
      };
      setMessages(e => [newMsg, ...e]);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('typingStatus', setSubHeaderText);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('typingStatus', setSubHeaderText);
    };
  }, [socket]);

  const onInputChange = (e: string) => {
    socket.emit(e ? 'typingStart' : 'typingEnd', roomId);
  };

  return (
    <Layout>
      <SafeAreaView>
        <ChatHeader {...{ route, navigation, subHeaderText }} />
        <ImageBackground
          className="h-[88vh]"
          style={{ paddingBottom: insets.bottom }}
          source={require('../../assets/images/whatsapp-dark-whatsapp.jpeg')}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            renderAvatar={null}
            messagesContainerStyle={{ paddingBottom: 10 }}
            renderMessage={ChatMessage}
            renderInputToolbar={props => (
              <ChatInput {...props} onValueChange={onInputChange} />
            )}
            user={currentUser}
          />
        </ImageBackground>
      </SafeAreaView>
    </Layout>
  );
};

export default Chat;
