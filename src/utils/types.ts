export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Listing: undefined;
  Chats: undefined;
  Updates: undefined;
  Call: undefined;
  NewChat: undefined;
  Chat: { id: string; name: string };
};

export type LoginParams = {
  email: string;
  password: string;
};
export type RegisterParams = {
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePhoto: string;
};

export interface AxiosResponse<T> {
  data: T;
  message: string;
  status: string;
}

export interface LoginResponse {
  data: UserDetails;
  refreshToken: string;
  token: string;
}

export interface RecentChatItem {
  _id: string;
  chatRoomId: string;
  message: string;
  type: string;
  postedByUser: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export type OnVideoCall =
  | undefined
  | {
      chatRoomId: string;
      type: string;
      usersDetails: UserDetails;
    };

export interface UserDetails {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  updatedAt: string;
}

export interface InitiateChatParams {
  userIds: string[];
}
export interface CallUserParams {
  type: string;
  chatRoomId: string;
}

export interface MessageParams {
  type: 'TEXT' | 'IMAGE' | 'VIDEO';
  content: string;
}

export interface ChatItemType {
  __v: number;
  _id: string;
  chatRoomId: string;
  createdAt: string;
  message: string;
  postedByUser: string;
  readByRecipients: ReadByRecipient[];
  type: string;
  updatedAt: string;
}

export interface ReadByRecipient {
  readAt: string;
  readByUserId: string;
}
